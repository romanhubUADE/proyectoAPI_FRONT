// src/components/Filters.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

const norm = (s = "") =>
  (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function Filters({ onChange = () => {} }) {
  const { isAdmin } = useAuth();

  const [cats, setCats] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [selected, setSelected] = useState("");

  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.listCategories();
        if (!active) return;
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setCats(arr);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    onChange({ categories: [...checked] });
  }, [checked, onChange]);

  const toggleCat = (desc, isChecked) => {
    const key = norm(desc);
    const next = new Set(checked);
    isChecked ? next.add(key) : next.delete(key);
    setChecked(next);
  };

  const handleSelect = (value) => {
    setSelected(value);
    setMin("");
    setMax("");
    onChange({ range: value, min: "", max: "" });
  };

  const handleMinMax = () => {
    setSelected("");
    onChange({ range: "", min, max });
  };

  const submitNewCategory = async () => {
    const description = newCat.trim();
    if (!description) return;
    setSaving(true);
    setErr("");
    try {
      const created = await api.createCategory({ description });
      const c = created?.data || created;
      setCats((prev) => [...prev, c]);
      setNewCat("");
      setAdding(false);
    } catch (e) {
      setErr(e?.body?.message || e?.message || "Error al crear categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="mt-8 sticky top-28 rounded-xl border border-stone-800 bg-[#20160F] p-6 h-fit">
      <h2 className="text-2xl font-bold text-stone-100">Filtros</h2>

      <div className="mt-4 space-y-6">
        {/* Categoría */}
        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Categoría</h3>

          {loading ? (
            <div className="text-stone-400 text-sm">Cargando…</div>
          ) : (
            <div className="space-y-2 text-stone-300 text-sm">
              {cats.map((c) => (
                <label key={c.id ?? c.description} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-600 bg-transparent text-amber-500 focus:ring-amber-500"
                    checked={checked.has(norm(c.description))}
                    onChange={(e) => toggleCat(c.description, e.target.checked)}
                  />
                  {c.description}
                </label>
              ))}

              {/* Agregar categoría (solo ADMIN) */}
              {isAdmin && !adding && (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="mt-2 text-amber-400 text-sm font-semibold hover:text-amber-300"
                >
                  + Agregar categoría
                </button>
              )}

              {isAdmin && adding && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="Nueva categoría"
                    className="w-full rounded-md bg-stone-900 border border-stone-700 px-2 py-1 text-stone-200 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={submitNewCategory}
                      disabled={saving}
                      className="rounded bg-amber-500 px-2 py-1 text-black text-xs font-semibold disabled:opacity-60"
                    >
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdding(false);
                        setNewCat("");
                        setErr("");
                      }}
                      className="text-stone-400 text-xs hover:text-stone-200"
                    >
                      Cancelar
                    </button>
                  </div>
                  {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Precio */}
        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Precio</h3>
          <div className="space-y-2 text-stone-300 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selected === "low"}
                onChange={() => handleSelect("low")}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500"
              />
              Hasta $100.000
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selected === "mid"}
                onChange={() => handleSelect("mid")}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500"
              />
              $100.000 a $150.000
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selected === "high"}
                onChange={() => handleSelect("high")}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500"
              />
              Más de $150.000
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-grow">
              <input
                type="number"
                placeholder="Mínimo"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-24 rounded-md bg-stone-900 border border-stone-700 px-2 py-1 text-stone-200 text-sm"
              />
              <span className="text-stone-400">—</span>
              <input
                type="number"
                placeholder="Máximo"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="w-24 rounded-md bg-stone-900 border border-stone-700 px-2 py-1 text-stone-200 text-sm"
              />
            </div>
           <button
  onClick={handleMinMax}
  className="p-1 rounded bg-stone-800 text-stone-400 text-xs hover:bg-stone-700 hover:text-stone-100 transition"
  title="Aplicar filtro"
>
  →
</button>

          </div>
        </section>
      </div>
    </aside>
  );
}

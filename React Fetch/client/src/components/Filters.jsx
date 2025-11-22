// src/components/Filters.jsx
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchCategories,
  createCategory,
  resetCreateStatus,
} from "../redux/categoriesSlice.js";

const norm = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function Filters({ onChange }) {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const {
    items: categories,
    status,
    error,
    createStatus,
    createError,
  } = useSelector((s) => s.categories);

  // cargar categorías al montar
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // selección de categorías
  const [selectedCats, setSelectedCats] = useState(new Set());

  // filtros de precio
  const [range, setRange] = useState(""); // "", "low", "mid", "high"
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // creación de categoría (solo admin)
  const [newCatName, setNewCatName] = useState("");

  // normalizar categorías a un formato simple
  const options = useMemo(() => {
    return (Array.isArray(categories) ? categories : []).map((c) => ({
      id: c.id,
      name: c.name || c.nombre || c.description || "",
      slug: norm(c.name || c.nombre || c.description || ""),
    }));
  }, [categories]);

  // notificar cambios al padre
  useEffect(() => {
    const catsArr = [...selectedCats];

    onChange?.({
      categories: catsArr,
      range,
      min,
      max,
    });
  }, [selectedCats, range, min, max, onChange]);

  const toggleCat = useCallback((slug) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const handleRangeChange = (value) => {
    setRange(value);
    if (value !== "") {
      setMin("");
      setMax("");
    }
  };

  const handleCustomPriceChange = (field, value) => {
    setRange("");
    if (field === "min") setMin(value);
    if (field === "max") setMax(value);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;

    await dispatch(createCategory({ name }));
    setNewCatName("");
  };

  // limpiar createStatus cuando cambie
  useEffect(() => {
    if (createStatus === "ready") {
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch]);

  return (
    <aside className="rounded-2xl bg-stone-950/60 p-5 text-sm text-stone-200 ring-1 ring-stone-800/70">
      <h2 className="mb-4 text-base font-semibold text-stone-100">
        Filtros
      </h2>

      {/* Categorías */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            Categorías
          </span>
          {status === "loading" && (
            <span className="text-[10px] text-stone-500">
              cargando…
            </span>
          )}
        </div>

        {status === "error" && (
          <p className="mb-2 text-xs text-red-400">
            Error al cargar categorías: {error}
          </p>
        )}

        <div className="space-y-1">
          {options.map((c) => (
            <label
              key={c.id ?? c.slug}
              className="flex cursor-pointer items-center gap-2 text-xs text-stone-200"
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-stone-600 bg-stone-950"
                checked={selectedCats.has(c.slug)}
                onChange={() => toggleCat(c.slug)}
              />
              <span>{c.name}</span>
            </label>
          ))}

          {!options.length && status === "ready" && (
            <p className="text-xs text-stone-500">
              Sin categorías disponibles.
            </p>
          )}
        </div>

        {isAdmin && (
          <form
            onSubmit={handleCreateCategory}
            className="mt-3 space-y-2 border-t border-stone-800 pt-3"
          >
            <p className="text-[11px] font-medium text-stone-400">
              Nueva categoría
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nombre"
                className="flex-1 rounded-md border border-stone-700 bg-stone-950 px-2 py-1.5 text-[11px] outline-none"
              />
              <button
                type="submit"
                disabled={createStatus === "loading"}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-stone-900 disabled:opacity-60"
              >
                {createStatus === "loading" ? "…" : "Crear"}
              </button>
            </div>
            {createError && (
              <p className="text-[11px] text-red-400">
                {createError}
              </p>
            )}
          </form>
        )}
      </section>

      {/* Precio */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
          Precio
        </p>

        <div className="space-y-1 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-range"
              className="h-3.5 w-3.5"
              checked={range === "low"}
              onChange={() => handleRangeChange("low")}
            />
            Hasta $100.000
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-range"
              className="h-3.5 w-3.5"
              checked={range === "mid"}
              onChange={() => handleRangeChange("mid")}
            />
            $100.000 – $150.000
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-range"
              className="h-3.5 w-3.5"
              checked={range === "high"}
              onChange={() => handleRangeChange("high")}
            />
            Más de $150.000
          </label>

          <div className="mt-3 grid grid-cols-[1fr,auto,1fr] items-center gap-1">
            <input
              type="number"
              min="0"
              placeholder="Mín"
              value={min}
              onChange={(e) =>
                handleCustomPriceChange("min", e.target.value)
              }
              className="w-full rounded-md border border-stone-700 bg-stone-950 px-2 py-1.5 text-[11px] outline-none"
            />
            <span className="px-1 text-center text-[11px] text-stone-400">
              –
            </span>
            <input
              type="number"
              min="0"
              placeholder="Máx"
              value={max}
              onChange={(e) =>
                handleCustomPriceChange("max", e.target.value)
              }
              className="w-full rounded-md border border-stone-700 bg-stone-950 px-2 py-1.5 text-[11px] outline-none"
            />
          </div>
        </div>
      </section>
    </aside>
  );
}

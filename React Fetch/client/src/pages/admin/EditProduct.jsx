// SOLO ADMINISTRADOR

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4002";

export default function EditProduct() {
  const { id } = useParams(); // "new" o un id numérico
  const nav = useNavigate();
  const creating = useMemo(() => id === "new", [id]);

  const [loading, setLoading] = useState(!creating);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState([
    { k: "Top Wood", v: "" },
    { k: "Back & Sides Wood", v: "" },
    { k: "Neck Wood", v: "" },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    activo: true,
    categoryId: "",
  });

  // Cargar producto existente
  useEffect(() => {
    if (creating) return;
    (async () => {
      setLoading(true);
      const r = await fetch(`${API}/products/${id}`);
      if (!r.ok) return nav("/admin/products");
      const p = await r.json();
      setForm({
        name: p.name ?? "",
        description: p.description ?? "",
        price: p.price ?? "",
        activo: p.activo ?? true,
        categoryId: p.category?.id ?? p.category_id ?? "",
      });
      setImages(p.images ?? []);
      setSpecs(
        (p.specifications ?? []).map(s => ({ k: s.name ?? s.key, v: s.value }))
      );
      setLoading(false);
    })();
  }, [creating, id, nav]);

  const onChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const upsert = async () => {
    setSaving(true);
    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price || 0),
      activo: !!form.activo,
      categoryId: form.categoryId || null,
      specifications: specs.filter(s => s.k && s.v).map(s => ({ name: s.k, value: s.v })),
    };
    const r = await fetch(`${API}/products${creating ? "" : `/${id}`}`, {
      method: creating ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      const saved = await r.json();
      // Subir imágenes nuevas si hay File objects en images[]
      const files = images.filter(x => x instanceof File);
      if (files.length) {
        const fd = new FormData();
        files.forEach(f => fd.append("files", f));
        await fetch(`${API}/products/${creating ? saved.id : id}/images`, { method: "POST", body: fd });
      }
      nav(`/admin/products/${creating ? saved.id : id}`);
    }
    setSaving(false);
  };

  const del = async () => {
    if (creating) return;
    if (!confirm("Eliminar producto?")) return;
    const r = await fetch(`${API}/products/${id}`, { method: "DELETE" });
    if (r.ok) nav("/admin/products");
  };

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-2 gap-6">
      {/* Galería */}
      <section>
        <div className="aspect-video rounded-lg overflow-hidden bg-stone-900/30 grid place-items-center">
          {images[0] && !(images[0] instanceof File) ? (
            <img src={images[0].url ?? images[0]} alt="" className="h-full w-full object-cover" />
          ) : images[0] ? (
            <img src={URL.createObjectURL(images[0])} className="h-full w-full object-cover" />
          ) : (
            <span className="text-stone-400">Sin imagen</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((img, i) => (
            <div key={i} className="aspect-video rounded overflow-hidden bg-stone-900/30">
              {img instanceof File ? (
                <img src={URL.createObjectURL(img)} className="h-full w-full object-cover" />
              ) : (
                <img src={img.url ?? img} className="h-full w-full object-cover" />
              )}
            </div>
          ))}
        </div>

        <label className="mt-4 block border-2 border-dashed rounded-lg py-4 text-center cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files || [])])}
          />
          Añadir imágenes
        </label>
      </section>

      {/* Formulario */}
      <section className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Nombre del producto"
          className="w-full rounded border-stone-600 bg-transparent"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={5}
          placeholder="Descripción"
          className="w-full rounded border-stone-600 bg-transparent"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={onChange}
          placeholder="Precio"
          className="w-full rounded border-stone-600 bg-transparent"
        />
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="activo" checked={form.activo} onChange={onChange} />
            Activo
          </label>
          <input
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            placeholder="Category ID"
            className="rounded border-stone-600 bg-transparent"
          />
        </div>

        <div className="pt-4">
          <h3 className="font-semibold mb-2">Especificaciones</h3>
          <div className="space-y-2">
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  value={s.k}
                  onChange={e => setSpecs(arr => arr.map((x, ix) => (ix === i ? { ...x, k: e.target.value } : x)))}
                  placeholder="Nombre"
                  className="rounded border-stone-600 bg-transparent"
                />
                <input
                  value={s.v}
                  onChange={e => setSpecs(arr => arr.map((x, ix) => (ix === i ? { ...x, v: e.target.value } : x)))}
                  placeholder="Valor"
                  className="rounded border-stone-600 bg-transparent"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecs(s => [...s, { k: "", v: "" }])}
              className="text-primary hover:underline"
            >
              + Añadir especificación
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={upsert}
            disabled={saving}
            className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
          >
            {creating ? "Crear" : "Guardar"}
          </button>
          {!creating && (
            <button onClick={del} className="px-4 py-2 rounded border border-red-600 text-red-600">
              Eliminar
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
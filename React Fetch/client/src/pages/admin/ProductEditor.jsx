// src/pages/admin/ProductEditor.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRole } from "../../auth/RoleContext.jsx";

const BASE = import.meta.env.VITE_API_URL; // ej: http://localhost:4002/api
const emptySpec = () => ({ name: "", value: "" });

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // [{url, file?}]
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [longDesc, setLongDesc] = useState("");
  const [specs, setSpecs] = useState([emptySpec()]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${BASE}/products/${id}`);
        if (!r.ok) throw new Error("No se pudo cargar el producto");
        const p = await r.json();

        if (!alive) return;
        setName(p.name ?? "");
        setShortDesc(p.description ?? "");
        setPrice(String(p.price ?? ""));
        setStock(p.stock ?? 0);
        setLongDesc(p.longDescription ?? "");
        setSpecs(
          (p.specs ?? []).map(s => ({ name: s.name, value: s.value })) || [emptySpec()]
        );
        // si backend entrega ids, podés mapear a URL binaria así:
        // setImages((p.images ?? []).map(img => ({ url: `${BASE}/products/${id}/images/${img.id}` })));
        setImages((p.images ?? []).map(u => ({ url: u })));
      } catch (e) {
        console.error(e);
        alert("Error cargando producto");
        navigate("/admin");
        return;
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, navigate]);

  if (role !== "ADMIN") return null;
  if (loading) return <main className="p-8">Cargando…</main>;

  const handleAddSpec = () => setSpecs(a => [...a, emptySpec()]);
  const handleSpecChange = (i, key, val) =>
    setSpecs(a => a.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  const handleRemoveSpec = (i) => setSpecs(a => a.filter((_, idx) => idx !== i));

  const handleAddImages = (files) => {
    const list = Array.from(files).slice(0, 6 - images.length);
    const mapped = list.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...mapped]);
  };
  const handleRemoveImage = (i) =>
    setImages(prev => prev.filter((_, idx) => idx !== i));

  const payload = () => ({
    name,
    description: shortDesc,
    longDescription: longDesc,
    price: Number(price),
    stock: Number(stock),
    specs: specs.filter(s => s.name || s.value),
  });

  const save = async () => {
    // 1) datos del producto
    const r = await fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    });
    if (!r.ok) return alert("Error al guardar");

    // 2) imágenes nuevas
    const form = new FormData();
    images.forEach(im => { if (im.file) form.append("files", im.file); });
    if ([...form.keys()].length) {
      const up = await fetch(`${BASE}/products/${id}/images`, {
        method: "POST",
        body: form,
      });
      if (!up.ok) return alert("Error subiendo imágenes");
    }

    alert("Guardado");
    navigate("/admin");
  };

  const del = async () => {
    if (!confirm("¿Eliminar producto?")) return;
    const r = await fetch(`${BASE}/products/${id}`, { method: "DELETE" });
    if (!r.ok) return alert("No se pudo eliminar");
    navigate("/admin");
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-stone-400">
        <button onClick={() => navigate(-1)} className="hover:text-primary">Acoustic Guitars</button>
        <span className="mx-2">/</span>
        <span className="text-stone-200">Edit Product</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT: images grid */}
        <section>
          {/* main image */}
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-stone-800">
            {images[0] ? (
              <img src={images[0].url} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-500">Sin imagen</div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => handleAddImages(e.target.files)}
            />
          </div>

          {/* two thumbs */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[images[1], images[2]].map((im, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-800">
                {im ? (
                  <>
                    <img src={im.url} className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(i + 1)}
                      className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white"
                    >
                      Quitar
                    </button>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">—</div>
                )}
              </div>
            ))}
          </div>

          {/* Add Image dashed */}
          <label className="mt-6 flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-amber-600/50 text-amber-400 hover:bg-amber-600/5">
            Add Image
            <input multiple accept="image/*" type="file" className="hidden" onChange={(e) => handleAddImages(e.target.files)} />
          </label>
        </section>

        {/* RIGHT: form */}
        <section>
          <input
            className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-3xl font-bold text-stone-100 focus:border-amber-600 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            rows={3}
            className="mt-3 w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="Breve descripción…"
          />

          <div className="mt-5 grid grid-cols-2 gap-4">
            <input
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-2xl font-bold text-amber-400 focus:border-amber-600 focus:outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$0.00"
            />
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
            />
          </div>

          <div className="mt-5 flex gap-4">
            <button
              onClick={save}
              className="flex-1 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Save Product
            </button>
            <button
              onClick={del}
              className="flex-1 rounded-lg bg-red-700/25 px-6 py-3 text-sm font-semibold text-red-300 hover:bg-red-700/35"
            >
              Delete Product
            </button>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-stone-200">Description</h3>
          <textarea
            rows={8}
            className="mt-3 w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
          />

          <h3 className="mt-8 text-lg font-semibold text-stone-200">Specifications</h3>
          <div className="mt-4 space-y-3">
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <input
                  className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200 focus:border-amber-600 focus:outline-none"
                  value={s.name}
                  onChange={(e) => handleSpecChange(i, "name", e.target.value)}
                  placeholder="Top Wood"
                />
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200 focus:border-amber-600 focus:outline-none"
                    value={s.value}
                    onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                    placeholder="Solid Spruce"
                  />
                  <button
                    onClick={() => handleRemoveSpec(i)}
                    className="rounded-lg bg-stone-700 px-3 py-2 text-xs text-white hover:bg-stone-600"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddSpec}
            className="mt-4 w-full rounded-lg border-2 border-dashed border-amber-600/50 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-600/5"
          >
            Add Specification
          </button>
        </section>
      </div>
    </main>
  );
}
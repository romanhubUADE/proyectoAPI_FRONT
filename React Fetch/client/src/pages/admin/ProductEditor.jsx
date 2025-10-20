// src/pages/admin/ProductEditor.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";
const emptySpec = () => ({ name: "", value: "" });

export default function ProductEditor() {
  const { id } = useParams();                 // numérico
  const navigate = useNavigate();
  const { api } = useShop();
  const { isAdmin, token } = useAuth();       // usar JWT real

  // bloquea si no es ADMIN (no uses RoleContext aquí)
  if (!isAdmin) return null;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);   // [{url} | {file, url}]
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [longDesc, setLongDesc] = useState("");
  const [specs, setSpecs] = useState([emptySpec()]);

  // carga producto
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await api.getProduct(id); // GET /api/products/:id
        if (!alive) return;
        setName(p.name ?? "");
        setShortDesc(p.description ?? "");
        setPrice(String(p.price ?? ""));
        setStock(p.stock ?? 0);
        setLongDesc(p.longDescription ?? "");
        setSpecs(
          (p.specs ?? []).map(s => ({ name: s.name, value: s.value })) || [emptySpec()]
        );
        // normaliza imagenes a {url}
        const imgs = Array.isArray(p.images) ? p.images : [];
        setImages(imgs.map(u => ({ url: typeof u === "string" ? u : u?.url })));
      } catch (e) {
        console.error(e);
        alert("No se pudo cargar el producto");
        navigate("/admin");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, api, navigate]);

  const handleAddSpec = () => setSpecs(a => [...a, emptySpec()]);
  const handleSpecChange = (i, key, val) =>
    setSpecs(a => a.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  const handleRemoveSpec = (i) => setSpecs(a => a.filter((_, idx) => idx !== i));

  const handleAddImages = (files) => {
    const list = Array.from(files).slice(0, Math.max(0, 6 - images.length));
    const mapped = list.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...mapped]);
  };
  const handleRemoveImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const payload = () => ({
    name,
    description: shortDesc,
    longDescription: longDesc,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    specs: specs.filter(s => s.name || s.value),
  });

  // guardar
  const save = async () => {
    try {
      // 1) datos (PATCH con Bearer)
      await api.patchProduct(id, payload());

      // 2) imágenes nuevas -> tu backend /api/products/{id}/images espera "file" UNA por request
      const newFiles = images.filter(im => im.file);
      for (const im of newFiles) {
        const fd = new FormData();
        fd.append("file", im.file); // clave correcta
        const res = await fetch(`${BASE}/products/${id}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error("Error subiendo imágenes");
      }

      alert("Guardado");
      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert(e.message || "Error al guardar");
    }
  };

  const del = async () => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.deleteProduct(id); // DELETE con Bearer
      navigate("/admin");
    } catch {
      alert("No se pudo eliminar");
    }
  };

  if (loading) return <main className="p-8 text-stone-300">Cargando…</main>;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* migas */}
      <div className="mb-6 text-sm text-stone-400">
        <button onClick={() => navigate(-1)} className="hover:text-primary">Volver</button>
        <span className="mx-2">/</span>
        <span className="text-stone-200">Editar producto</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imágenes */}
        <section>
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

          <label className="mt-6 flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-amber-600/50 text-amber-400 hover:bg-amber-600/5">
            Agregar imágenes
            <input multiple accept="image/*" type="file" className="hidden" onChange={(e) => handleAddImages(e.target.files)} />
          </label>
        </section>

        {/* Formulario */}
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
              Guardar
            </button>
            <button
              onClick={del}
              className="flex-1 rounded-lg bg-red-700/25 px-6 py-3 text-sm font-semibold text-red-300 hover:bg-red-700/35"
            >
              Eliminar
            </button>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-stone-200">Descripción</h3>
          <textarea
            rows={8}
            className="mt-3 w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
          />

          <h3 className="mt-8 text-lg font-semibold text-stone-200">Especificaciones</h3>
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
                    onClick={() => setSpecs(a => a.filter((_, idx) => idx !== i))}
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
            Agregar especificación
          </button>
        </section>
      </div>
    </main>
  );
}

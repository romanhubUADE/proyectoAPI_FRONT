// SOLO ADMIN. Crear ("new") o editar (/:id)

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../../context/ShopContext.jsx";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

export default function EditProduct() {
  const { id } = useParams();
  const creating = useMemo(() => id === "new", [id]);
  const nav = useNavigate();
  const { dispatch, api } = useShop();

  const [loading, setLoading] = useState(!creating);
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [longDesc, setLongDesc] = useState("");

  const token = localStorage.getItem("token") || "";

  // Cargar producto existente
  useEffect(() => {
    if (creating) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${BASE}/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!r.ok) throw new Error("No encontrado");
        const p = await r.json();
        if (!alive) return;
        setName(p.name ?? "");
        setPrice(p.price ?? "");
        setCategory(p.category ?? "");
        setStock(p.stock ?? "");
        setLongDesc(p.longDescription ?? "");
        setImages(Array.isArray(p.images) ? p.images : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [creating, id, token]);

  const addImages = (fileList) => {
    const files = Array.from(fileList || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  // === BLOQUE DE GUARDADO CORRECTO ===
  const save = async () => {
    try {
      setSaving(true);

      if (!token) {
        alert("Token no encontrado. Iniciá sesión como administrador.");
        return;
      }

      // Crear producto (POST)
      const res = await fetch(`${BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,                     // requerido por ProductCreateDTO
          longDescription: longDesc ?? "", // si es opcional
          categoryId: Number(categoryId),  // requerido por ProductCreateDTO
          price: Number(price || 0),
          stock: Number(stock || 0),
          activo: true
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(`Error al crear producto (${res.status}): ${msg}`);
        return;
      }

      const created = await res.json();
      const prodId = created.id;

      // Subir imágenes (una por request)
      const newFiles = images.filter((im) => im instanceof File);
      for (const file of newFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch(`${BASE}/products/${prodId}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!up.ok) {
          const txt = await up.text();
          console.warn(`Error subiendo imagen (${up.status}): ${txt}`);
        }
      }

      // Refrescar catálogo
      try {
        const raw = await api.listProducts?.();
        const list = toArray(raw);
        dispatch({ type: "SET_PRODUCTS", payload: list });
      } catch {}

      alert("Producto creado con éxito");
      nav("/catalog", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto: " + err.message);
    } finally {
      setSaving(false);
    }
  };
  // === FIN BLOQUE ===

  if (loading) return <main className="p-6 text-stone-300">Cargando…</main>;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 text-sm text-stone-400">
        Catálogo <span className="mx-2">/</span>
        <span className="text-stone-200">{creating ? "Nuevo producto" : "Editar producto"}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imágenes */}
        <section>
          <div className="relative w-full overflow-hidden rounded-xl bg-stone-800" style={{ aspectRatio: "16/11" }}>
            {images[0]
              ? (
                images[0] instanceof File
                  ? <img src={URL.createObjectURL(images[0])} className="h-full w-full object-cover" />
                  : <img src={typeof images[0] === "string" ? images[0] : images[0].url} className="h-full w-full object-cover" />
              )
              : <div className="flex h-full items-center justify-center text-stone-500">Sin imagen</div>
            }
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => addImages(e.target.files)}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-800">
                {img instanceof File
                  ? <img src={URL.createObjectURL(img)} className="h-full w-full object-cover" />
                  : <img src={typeof img === "string" ? img : img.url} className="h-full w-full object-cover" />
                }
                <button
                  onClick={() => removeImage(i)}
                  className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <label className="mt-6 flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-amber-600/50 text-amber-400 hover:bg-amber-600/5">
            Añadir imágenes
            <input multiple accept="image/*" type="file" className="hidden" onChange={(e) => addImages(e.target.files)} />
          </label>
        </section>

        {/* Formulario */}
        <section>
          <input
            className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-3xl font-bold text-stone-100 focus:border-amber-600 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del producto"
          />

          <div className="mt-3 grid grid-cols-3 gap-4">
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Category ID"
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-xl font-bold text-stone-200 focus:border-amber-600 focus:outline-none"
            />
            <textarea
             rows={3}
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             placeholder="Descripción breve..."
             className="mt-3 w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
           />
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-xl font-bold text-amber-400 focus:border-amber-600 focus:outline-none"
            />
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-xl font-bold text-stone-200 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="mt-5 w-full rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
          >
            {creating ? "Crear producto" : "Guardar producto"}
          </button>

          <h3 className="mt-8 text-lg font-semibold text-stone-200">Descripción</h3>
          <textarea
            rows={8}
            className="mt-3 w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            placeholder="Descripción detallada del producto..."
          />
        </section>
      </div>
    </main>
  );
}
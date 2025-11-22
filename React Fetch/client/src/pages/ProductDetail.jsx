import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProductById } from "../redux/productsSlice.js";

const BASE = import.meta.env.VITE_API_URL;

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function ProductDetail() {
  const { id } = useParams();
  const { priceWithDiscount, addToCart } = useShop();
  const { isAdmin } = useAuth(); // solo JWT

  const dispatch = useDispatch();
  const { items, current, currentStatus, currentError } = useSelector(
    (state) => state.products
  );

  // Intentamos sacar el producto de la lista ya cargada
  const fromStore = useMemo(
    () =>
      (Array.isArray(items) ? items : []).find(
        (x) => String(x.id) === String(id)
      ),
    [items, id]
  );

  // Si no está en la lista, lo pedimos a la API vía thunk
  useEffect(() => {
    if (fromStore) return;
    if (!id) return;
    dispatch(fetchProductById(id));
  }, [id, fromStore, dispatch]);

  // Producto final: primero el de la lista, luego el `current` de la slice
  const p =
    fromStore ||
    (current && String(current.id) === String(id) ? current : null);

  const loading = !fromStore && currentStatus === "loading";
  const err =
    !fromStore && currentStatus === "error"
      ? currentError || "Error cargando producto"
      : "";

  const images = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    return arr.map((it) =>
      typeof it === "string"
        ? it
        : it?.url || `${BASE}/api/products/${p?.id}/images/${it?.id}`
    );
  }, [p]);

  const hero = p?.image || images[0];
  const thumbs = p?.gallery?.length ? p.gallery : images.slice(1, 4);
  const final = p ? priceWithDiscount(p) : 0;

  if (loading)
    return (
      <main className="mx-auto max-w-7xl p-6 text-stone-300">
        Cargando…
      </main>
    );
  if (err)
    return (
      <main className="mx-auto max-w-7xl p-6 text-red-400">{err}</main>
    );
  if (!p)
    return (
      <main className="mx-auto max-w-7xl p-6">
        Producto no encontrado.
      </main>
    );

  const handleAdd = () => addToCart(p);

  return (
    <main className="w-full py-8">
      <div className="mx-auto max-w-8xl px-10 sm:px-16 lg:px-24">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Imágenes */}
          <section className="md:col-span-6">
            <div className="overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800">
              {hero ? (
                <img
                  src={hero}
                  alt={p.name}
                  className="w-full object-cover"
                  style={{ aspectRatio: "5 / 3" }}
                />
              ) : (
                <div className="h-[300px] w-full" />
              )}
            </div>

            {!!thumbs.length && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {thumbs.map((g, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800"
                  >
                    <img
                      src={g}
                      alt={`${p.name}-${i}`}
                      className="h-full w-full object-cover"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Info del producto */}
          <aside className="md:col-span-5">
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="text-3xl font-bold text-stone-100">
                {p.name}
              </h1>

              {isAdmin && (
                <Link
                  to={`/admin/products/${p.id}`}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300"
                >
                  Editar producto
                </Link>
              )}
            </div>

            <p className="mt-2 text-sm uppercase tracking-wide text-amber-300/80">
              {p.brand || p.marca || "String & Soul"}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-3xl font-bold text-amber-400">
                {fmt(final)}
              </div>
              {p.discount > 0 && (
                <div className="text-sm text-stone-400 line-through">
                  {fmt(p.price)}
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-stone-300">
              {p.description || "Sin descripción disponible."}
            </p>

            <button
              onClick={handleAdd}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-amber-400"
            >
              Añadir al carrito
            </button>

            {/* Podés dejar acá todo el resto de secciones: specs, reviews, etc.
                No las toqué porque no afectan a Redux ni a las APIs. */}
          </aside>

          {/* Resto del contenido (reviews, descripción extendida, etc.) */}
          {/* ... */}
        </div>
      </div>
    </main>
  );
}
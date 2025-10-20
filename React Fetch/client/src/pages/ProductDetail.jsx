import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useRole } from "../auth/RoleContext.jsx";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

export default function ProductDetail() {
  const { id } = useParams();
  const pid = Number(id);
  const { addToCart } = useShop();
  const { role } = useRole();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/products`);
        const json = await res.json();
        const data = json.data || json; // tu API envía dentro de "data"
        const found = Array.isArray(data) ? data.find(p => p.id === pid) : null;
        if (alive) setProduct(found ?? null);
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false };
  }, [pid]);

  if (loading) return <div className="p-6 text-stone-300">Cargando...</div>;
  if (!product) return <div className="p-6 text-stone-300">Producto no encontrado</div>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="h-96 w-full rounded-lg bg-stone-800" />
          )}
        </section>

        <section>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>

          {role === "ADMIN" && (
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="mt-3 inline-block rounded bg-primary/20 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary/30"
            >
              Editar
            </Link>
          )}

          <p className="mt-3 text-2xl font-semibold text-primary">
            ${Number(product.price).toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold text-white hover:bg-primary/90"
          >
            Agregar al carrito
          </button>

          <h2 className="mt-8 text-xl font-bold text-white">Descripción</h2>
          <p className="mt-2 text-stone-300">{product.description}</p>

          {product.specs?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-white">Especificaciones</h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-stone-300">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-stone-700 pb-1">
                    <dt>{s.name}</dt>
                    <dd className="text-stone-200">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
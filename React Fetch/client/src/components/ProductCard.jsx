// src/components/ProductCard.jsx
import { Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002";

export default function ProductCard({ p }) {
  const price = Number(p?.price ?? 0);
  const fmt = n =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  // Normalizar imagenes igual que en ProductDetail
  const images = Array.isArray(p?.images)
    ? p.images.map((it) =>
        typeof it === "string"
          ? it
          : it?.url || `${BASE}/api/products/${p?.id}/images/${it?.id}`
      )
    : [];

  const hero = p?.image || images[0];

  return (
    <article className="w-full max-w-[340px]">
      <Link to={`/product/${p.id}`} className="block">
        <div className="rounded-xl bg-[#F8D0B3] overflow-hidden">
          <div className="aspect-[4/5] w-full">
            {hero && (
              <img
                src={hero}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <Link
          to={`/product/${p.id}`}
          className="block text-[13px] font-semibold text-white hover:text-amber-400"
        >
          {p.name}
        </Link>
        <div className="mt-1 text-[13px] font-semibold text-amber-500">
          {fmt(price)}
        </div>
        <Link
          to={`/product/${p.id}`}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-amber-500"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
}
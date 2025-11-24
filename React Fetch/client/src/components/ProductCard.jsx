// src/components/ProductCard.jsx
import { Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002";

export default function ProductCard({ p, isAdminView = false }) {
  const price = Number(p?.price ?? 0);
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  // Normalizar imágenes igual que en ProductDetail
  const images = Array.isArray(p?.images)
    ? p.images.map((it) =>
        typeof it === "string"
          ? it
          : it?.url || `${BASE}/api/products/${p?.id}/images/${it?.id}`
      )
    : [];

  const image = images[0] ?? "/placeholder-guitar.jpg";

  const inactive =
    p?.activo === false || p?.activo === 0 || p?.activo === "0";

  return (
    <article
      className={`relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950/60 shadow-sm transition hover:border-amber-500/70 ${
        inactive && isAdminView ? "opacity-60" : ""
      }`}
    >
      <Link
        to={`/product/${p.id}`}
        className="block aspect-[3/4] bg-stone-900"
      >
        <img
          src={image}
          alt={p?.name ?? "Producto"}
          className={`h-full w-full object-cover ${
            inactive && isAdminView ? "grayscale" : ""
          }`}
        />
      </Link>

      {inactive && isAdminView && (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-2">
          <span className="rounded-full bg-red-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-100">
            Desactivado
          </span>
        </div>
      )}

      <div className="border-t border-stone-800 px-4 py-3">
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

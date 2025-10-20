import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const price = Number(p?.price ?? 0);
  const fmt = n =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <article className="w-full max-w-[340px]">
      <Link to={`/product/${p.id}`} className="block">
        <div className="rounded-xl bg-[#F8D0B3] overflow-hidden">
          <div className="aspect-[4/5] w-full">
            <img
              src={p.image || p.images?.[0]}
              alt={p.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="h-1.5 w-2/3 mx-auto -mt-2 mb-3 rounded-full bg-black/20" />
        </div>
      </Link>

      <div className="px-1 pt-2">
        <Link to={`/product/${p.id}`} className="text-[13px] leading-tight text-stone-200 hover:underline">
          {p.name}
        </Link>
        <div className="mt-1 text-[13px] font-semibold text-amber-500">{fmt(price)}</div>
        <Link
          to={`/product/${p.id}`}
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-amber-500"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
}
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function ProductCard({ p }) {
  const { dispatch, priceWithDiscount } = useShop();
  const final = priceWithDiscount ? priceWithDiscount(p) : p.price;

  return (
    <article className="group rounded-xl border border-white/10 bg-background-light/60 dark:bg-background-dark/60 overflow-hidden">
      <Link to={`/product/${p.id}`} className="block">
        <div className="h-64 w-full overflow-hidden">
          <img
            src={p.image || p.images?.[0]}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${p.id}`} className="text-lg font-medium hover:text-primary">
          {p.name}
        </Link>
        <p className="mt-1 text-sm opacity-70">{p.brand || p.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-semibold text-primary">${final}</div>
          {p.discount ? (
            <div className="text-xs line-through opacity-70">${p.price}</div>
          ) : null}
        </div>
        <button
          onClick={() => dispatch({ type: "ADD", payload: p })}
          className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

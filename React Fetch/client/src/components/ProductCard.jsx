import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function ProductCard({ p }) {
  const { dispatch, priceWithDiscount } = useShop();
  const final = priceWithDiscount(p);

  return (
    <article className="group rounded-lg">
      <Link to={`/product/${p.id}`} className="block overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800">
        <img
          src={p.image}
          alt={p.name}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link to={`/product/${p.id}`} className="text-lg font-medium hover:text-primary">
            {p.name}
          </Link>
          <p className="mt-1 text-sm opacity-70">{p.brand || p.category}</p>
        </div>

        <div className="text-right">
          <div className="text-base font-semibold text-primary">${final}</div>
          {p.discount ? (
            <div className="text-xs line-through opacity-70">${p.price}</div>
          ) : null}
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: "ADD", payload: p })}
        className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
      >
        Add to Cart
      </button>
    </article>
  );
}

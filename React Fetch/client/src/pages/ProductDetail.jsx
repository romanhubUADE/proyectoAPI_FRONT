import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { state, dispatch, priceWithDiscount } = useShop();

  const p = state.products.find(x => String(x.id) === id);
  if (!p) return <main className="mx-auto max-w-7xl p-6">Producto no encontrado.</main>;

  const final = priceWithDiscount(p);

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* galería simple */}
        <div>
          <div className="overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800">
            <img src={p.image} alt={p.name} className="w-full object-cover" />
          </div>
          {Array.isArray(p.gallery) && p.gallery.length ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {p.gallery.map((g, i) => (
                <img key={i} src={g} alt={`${p.name}-${i}`} className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          ) : null}
        </div>

        {/* info */}
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-2 opacity-80">{p.short || p.description || "—"}</p>

          <div className="mt-6 flex items-end gap-3">
            <div className="text-3xl font-extrabold text-primary">${final}</div>
            {p.discount ? <div className="text-lg line-through opacity-60">${p.price}</div> : null}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => dispatch({ type: "ADD", payload: p })}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/80"
            >
              Add to Cart
            </button>
            <span className="self-center text-sm opacity-70">{p.stock > 0 ? `${p.stock} en stock` : "Sin stock"}</span>
          </div>

          {/* specs opcionales */}
          <div className="mt-10">
            <h2 className="mb-3 text-xl font-bold">Specifications</h2>
            <dl className="-mx-4 divide-y divide-white/10 rounded-lg border border-white/10">
              {[
                ["Top Wood", p.topWood || p.woodTop],
                ["Back & Sides", p.backSides || p.wood],
                ["Neck", p.neck],
                ["Fretboard", p.fretboard],
                ["Scale", p.scale],
                ["Finish", p.finish],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3">
                  <dt className="opacity-70">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* reviews placeholder */}
      <section className="mt-14">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        <p className="mt-2 text-sm opacity-70">Próximamente.</p>
      </section>
    </main>
  );
}

import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function ProductDetail() {
  const { id } = useParams();
  const { state, dispatch, priceWithDiscount } = useShop();
  const p = state.products.find((x) => String(x.id) === id);

  if (!p) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        Producto no encontrado.
      </main>
    );
  }

  const hero = p.image || p.images?.[0];
  const thumbs = p.gallery?.length ? p.gallery : p.images?.slice(0, 3) || [];
  const final = priceWithDiscount(p);

return (
  <main className="mx-auto max-w-[1100px] px-8 py-6 sm:px-10 lg:px-16">
    {/* TOP: galería + info / BOTTOM: reviews a todo el ancho */}
    <div className="grid gap-10 md:grid-cols-12">
      {/* Galería (izquierda) */}
      <section className="md:col-span-7">
        <div className="overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800">
          <img
            src={hero}
            alt={p.name}
            className="w-full object-cover"
            style={{ aspectRatio: '4 / 3' }}
          />
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
                  style={{ aspectRatio: '4 / 3' }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Información (derecha) */}
      <aside className="md:col-span-5">
        <h1 className="text-3xl font-bold">{p.name}</h1>

        <div className="mt-4">
          <div className="text-2xl font-extrabold text-primary">
            {fmt(final)}
          </div>
          {p.discount ? (
            <div className="text-sm opacity-60 line-through">{fmt(p.price)}</div>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => dispatch({ type: "ADD", payload: p })}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/80"
          >
            Add to Cart
          </button>
          <span className="self-center text-sm opacity-70">
            {p.stock > 0 ? `${p.stock} en stock` : "Sin stock"}
          </span>
        </div>

        {/* Descripción */}
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">Description</h2>
          <p className="opacity-80">{p.short || p.description || "—"}</p>
        </section>

        {/* Especificaciones */}
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">Specifications</h2>
          <dl className="divide-y divide-white/10 rounded-lg border border-white/10">
            {[
              ["Top Wood", p.topWood || p.woodTop],
              ["Back & Sides", p.backSides || p.wood],
              ["Neck", p.neck],
              ["Fretboard", p.fretboard],
              ["Scale", p.scale],
              ["Nut Width", p.nutWidth],
              ["Finish", p.finish],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3">
                  <dt className="opacity-70">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
          </dl>
        </section>
      </aside>

      {/* Reviews abajo, a todo el ancho */}
      <section className="md:col-span-12">
        <h2 className="mt-4 text-lg font-bold">Customer Reviews</h2>
        <div className="mt-4 grid gap-4 rounded-lg border border-white/10 p-4 md:grid-cols-[160px,1fr]">
          <div>
            <div className="text-3xl font-bold">4.7</div>
            <div className="text-sm opacity-70">based on 125 reviews</div>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((n, i) => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-6 text-sm">{n}★</span>
                <div className="h-2 flex-1 rounded bg-stone-700">
                  <div
                    className="h-2 rounded bg-amber-500"
                    style={{ width: `${[75, 15, 6, 3, 1][i]}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs opacity-70">
                  {[75, 15, 6, 3, 1][i]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </main>
);
}
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
  <main className="w-full py-8">
    {/* Contenedor centrado con padding lateral */}
    <div className="mx-auto max-w-max-w-8xl px-10 sm:px-16 lg:px-24">
      <div className="grid gap-10 md:grid-cols-12">
        {/* Galería (izquierda) */}
        <section className="md:col-span-6">
          <div className="overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800">
            <img
              src={hero}
              alt={p.name}
              className="w-full object-cover"
              style={{ aspectRatio: '5 / 3' }}
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

          <div className="mt-5 flex gap-6">
            <button
              onClick={() => dispatch({ type: "ADD", payload: p })}
              className="rounded-lg bg-primary px-40 py-2 font-semibold text-white hover:bg-primary/80"
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
            <dl className="divide-y divide-white/10 rounded-lg">
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
                  .map(([k, v], i) => (
                    <div
                      key={k}
                      className={`grid grid-cols-2 gap-4 px-4 py-3 ${
                        i === 0 ? "border-t border-white/10" : ""
                      } border-b border-white/10`}
                    >
                      <dt className="opacity-70">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
            </dl>
          </section>
        </aside>

        {/* Reviews abajo, a todo el ancho */}
        <section className="md:col-span-12 mt-8">
          <h2 className="text-lg font-bold mb-3">Customer Reviews</h2>

          {/* Si hay reviews */}
          {p.reviews && p.reviews.length > 0 ? (
            <>
              {/* Calificación promedio + distribución */}
              {(() => {
                const total = p.reviews.length;
                const avg =
                  p.reviews.reduce((sum, r) => sum + r.rating, 0) / total;
                const counts = [5, 4, 3, 2, 1].map(
                  (n) => p.reviews.filter((r) => r.rating === n).length
                );
                return (
                  <div className="mt-4 grid gap-4 rounded-lg border border-white/10 p-4 md:grid-cols-[160px,1fr]">
                    {/* Promedio */}
                    <div>
                      <div className="text-3xl font-bold">
                        {avg.toFixed(1)}
                      </div>
                      <div className="text-sm opacity-70">
                        based on {total} review{total !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Barras por estrellas */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((n, i) => {
                        const percent =
                          total > 0 ? (counts[i] / total) * 100 : 0;
                        return (
                          <div
                            key={n}
                            className="flex items-center gap-3"
                          >
                            <span className="w-6 text-sm">{n}★</span>
                            <div className="h-2 flex-1 rounded bg-stone-700">
                              <div
                                className="h-2 rounded bg-amber-500 transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-xs opacity-70">
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Lista de comentarios */}
              <div className="mt-6 space-y-4">
                {p.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{r.user}</h4>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm opacity-90">{r.comment}</p>
                    <p className="mt-1 text-xs opacity-60">{r.date}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Si no hay reviews
            <div className="rounded-lg border border-white/10 p-4 text-sm opacity-80">
              Todavía no hay reseñas para este producto.
            </div>
          )}
        </section>



      </div>
    </div>
  </main>
);
}
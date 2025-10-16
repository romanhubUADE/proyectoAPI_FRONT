import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(n || 0));

export default function CartPage() {
  const { state, dispatch, priceWithDiscount } = useShop();
  const nav = useNavigate();

  const items = state.cart ?? [];
  const subtotal = items.reduce((t, i) => t + priceWithDiscount(i) * i.qty, 0);
  const setQty = (id, qty) =>
    dispatch({ type: "SET_QTY", payload: { id, qty: Math.max(1, qty | 0) } });

  // ---- helper: obtiene imagen confiable para cada item ----
  const getItemImage = (item) => {
    const prod =
      state.products?.find((p) => String(p.id) === String(item.id)) || null;
    return (
      item.image ||
      item.images?.[0] ||
      prod?.image ||
      prod?.images?.[0] ||
      "" // poné aquí un placeholder si querés, ej: "/img/placeholder.jpg"
    );
  };

  return (
    <main className="bg-background-light text-white dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Migas */}
        <p className="text-sm text-stone-400">
          <Link to="/catalog" className="hover:text-primary">Tienda</Link>
          <span className="mx-2">/</span>
          Carrito
        </p>

        <h1 className="mt-2 text-4xl font-extrabold">Carrito de compras</h1>

        {/* ===== Layout principal en 12 columnas ===== */}
        <div className="mt-10 grid gap-8 lg:[grid-template-columns:minmax(0,1fr)_360px]">
          {/* LISTA (izquierda) */}
          <aside className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-24 h-max bg-transparent border-none rounded-none p-0">
            <section className="lg:col-span-8">
              {items.length ? (
                <ul className="divide-y divide-white/10">
                  {items.map((i) => {
                    const img = getItemImage(i);
                    return (
                      <li key={i.id} className="py-6 first:border-t first:border-white/10">
                        <div className="grid grid-cols-[96px,1fr,auto] items-center gap-6">
                          <Link
                            to={`/product/${i.id}`}
                            className="h-24 w-24 overflow-hidden rounded-lg bg-stone-800"
                          >
                            <img
                              src={img}
                              alt={i.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </Link>

                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/product/${i.id}`}
                              className="text-lg font-semibold hover:text-primary"
                            >
                              {i.name}
                            </Link>
                            <p className="text-sm text-stone-400">{i.category}</p>

                            <div className="mt-1 flex items-center gap-3">
                              <button
                                onClick={() => setQty(i.id, i.qty - 1)}
                                className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                                aria-label="disminuir"
                              >
                                −
                              </button>
                              <input
                                value={i.qty}
                                onChange={(e) =>
                                  setQty(i.id, Number(e.target.value))
                                }
                                className="w-12 rounded-md border border-primary/20 bg-transparent p-1 text-center"
                              />
                              <button
                                onClick={() => setQty(i.id, i.qty + 1)}
                                className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                                aria-label="aumentar"
                              >
                                +
                              </button>

                              <button
                                onClick={() =>
                                  dispatch({ type: "REMOVE", payload: i.id })
                                }
                                className="ml-3 text-sm text-stone-400 hover:text-primary"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>

                          <p className="text-right text-lg font-semibold">
                            {fmt(priceWithDiscount(i) * i.qty)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-xl border border-white/10 p-8 text-center text-stone-300">
                  Carrito vacío.{" "}
                  <Link className="text-primary" to="/catalog">
                    Ir a la tienda
                  </Link>
                </div>
              )}
            </section>
          </aside>

          {/* RESUMEN (derecha) */}
          <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 h-max rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-300">Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-300">Envío</span>
                <span className="font-medium">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-300">Impuestos</span>
                <span className="font-medium">{fmt(0)}</span>
              </div>
            </div>

            <div className="my-6 h-px bg-primary/20" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <button
              disabled={!items.length}
              onClick={() => nav("/checkout")}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:opacity-50"
            >
              Continuar al pago
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
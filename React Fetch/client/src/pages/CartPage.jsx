import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

const fmt = n => `$${Number(n).toFixed(2)}`;

export default function CartPage() {
  const { state, dispatch, priceWithDiscount } = useShop();
  const nav = useNavigate();

  const items = state.cart ?? [];
  const subtotal = items.reduce((t, i) => t + priceWithDiscount(i) * i.qty, 0);

  const setQty = (id, qty) =>
    dispatch({ type: "SET_QTY", payload: { id, qty: Math.max(1, qty | 0) } });

  return (
    <main className="bg-background-light dark:bg-background-dark text-stone-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* migas */}
        <p className="text-sm text-stone-400">
          <Link to="/catalog" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          Cart
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-white">Your Cart</h1>

        {/* layout principal */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* LISTA */}
          <section className="lg:col-span-2">
            {items.length ? (
              <ul className="divide-y divide-primary/20">
                {items.map((i) => (
                  <li key={i.id} className="py-8">
                    <div className="flex items-center gap-6">
                      <Link
                        to={`/product/${i.id}`}
                        className="block h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-stone-800"
                      >
                        <img
                          src={i.image}
                          alt={i.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${i.id}`}
                              className="text-lg font-semibold text-white hover:text-primary"
                            >
                              {i.name}
                            </Link>
                            <p className="mt-1 text-sm text-stone-400">
                              {i.category}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-white">
                            {fmt(priceWithDiscount(i) * i.qty)}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQty(i.id, i.qty - 1)}
                              className="h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                              aria-label="decrease"
                            >
                              −
                            </button>
                            <input
                              value={i.qty}
                              onChange={(e) => setQty(i.id, Number(e.target.value))}
                              className="w-12 rounded-md border border-primary/30 bg-transparent p-1 text-center"
                            />
                            <button
                              onClick={() => setQty(i.id, i.qty + 1)}
                              className="h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                              aria-label="increase"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => dispatch({ type: "REMOVE", payload: i.id })}
                            className="text-sm text-stone-400 hover:text-primary"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-400">Carrito vacío. <Link className="text-primary" to="/catalog">Ir a la tienda</Link></p>
            )}
          </section>

          {/* RESUMEN sticky */}
          <aside className="h-max rounded-lg border border-primary/20 bg-primary/10 p-6 lg:sticky lg:top-24 overflow-hidden">
            <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-300">Subtotal</span>
                <span className="font-medium text-stone-100">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-300">Shipping</span>
                <span className="font-medium text-stone-100">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-300">Tax</span>
                <span className="font-medium text-stone-100">{fmt(0)}</span>
              </div>
            </div>

            <div className="my-6 h-px bg-primary/20" />

            <div className="flex justify-between font-bold text-white">
              <span>Total</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <button
              disabled={!items.length}
              onClick={() => nav("/checkout")}
              className="mt-8 w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:shadow-lg disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

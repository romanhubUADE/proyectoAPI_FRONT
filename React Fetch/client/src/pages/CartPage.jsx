import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function CartPage() {
  const { state, dispatch, priceWithDiscount } = useShop();
  const nav = useNavigate();

  const items = state.cart;
  const subtotal = items.reduce((t, i) => t + priceWithDiscount(i) * i.qty, 0);

  const setQty = (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty: Math.max(1, qty|0) } });

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold">Your Cart</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* listado */}
        <div className="space-y-6">
          {items.map(i => (
            <div key={i.id} className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-6">
                <Link to={`/product/${i.id}`} className="block w-28 overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800">
                  <img src={i.image} alt={i.name} className="aspect-square w-full object-cover" />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${i.id}`} className="text-lg font-medium hover:text-primary">{i.name}</Link>
                  <div className="mt-1 text-sm opacity-70">{i.category}</div>

                  <div className="mt-4 flex items-center gap-4">
                    <button className="rounded border px-2 py-1" onClick={() => setQty(i.id, i.qty - 1)}>-</button>
                    <input
                      value={i.qty} onChange={e => setQty(i.id, Number(e.target.value))}
                      className="w-12 rounded border bg-transparent p-1 text-center"
                    />
                    <button className="rounded border px-2 py-1" onClick={() => setQty(i.id, i.qty + 1)}>+</button>

                    <button
                      onClick={() => dispatch({ type: "REMOVE", payload: i.id })}
                      className="ml-4 text-sm opacity-80 hover:text-primary"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="w-28 text-right">
                  <div className="font-semibold text-primary">${priceWithDiscount(i) * i.qty}</div>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <p className="opacity-70">Carrito vacío.</p>}
        </div>

        {/* resumen */}
        <aside className="h-max rounded-xl border border-primary/20 bg-background-light p-6 dark:border-primary/20 dark:bg-background-dark">
          <h2 className="text-lg font-bold">Order Summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between"><span>Tax</span><span>$0.00</span></div>
          </div>

          <div className="mt-4 flex justify-between text-lg font-semibold">
            <span>Total</span><span>${subtotal}</span>
          </div>

          <button
            disabled={!items.length}
            onClick={() => nav("/checkout")}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary/80 disabled:opacity-50"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </main>
  );
}

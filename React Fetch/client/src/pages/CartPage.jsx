// src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(n || 0));

export default function CartPage() {
  const {
    cart,
    total,
    setCartQty,
    clearCart,
    removeOne,
    removeAll,
    priceWithDiscount,
  } = useShop();
  const { isAuth } = useAuth();
  const nav = useNavigate();

  const items = cart ?? [];

  // Imagen "confiable" por item, usando los datos del propio item
  const getItemImage = (item) => {
    return (
      item.image ||
      item.images?.[0] ||
      item.img ||
      item.imgUrl ||
      item.product?.image ||
      item.product?.images?.[0] ||
      ""
    );
  };

  const handleChangeQty = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);
    setCartQty(id, qty);
  };

  const handleDecrement = (id, currentQty) => {
    const next = Math.max(1, Number(currentQty || 1) - 1);
    setCartQty(id, next);
  };

  const handleIncrement = (id, currentQty) => {
    const next = (Number(currentQty) || 1) + 1;
    setCartQty(id, next);
  };

  const handleCheckout = () => {
    if (!items.length) return;

    if (!isAuth) {
      // mandalo a login y después que vuelva al carrito o checkout
      nav("/login?redirect=/cart");
      return;
    }

    nav("/checkout");
  };

  if (!items.length) {
    return (
      <main className="min-h-screen bg-stone-950 text-stone-100">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-6 text-3xl font-semibold">Carrito</h1>
          <div className="rounded-2xl bg-stone-900 p-8 text-center">
            <p className="mb-4 text-lg">Tu carrito está vacío.</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-black transition hover:brightness-110"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold">Carrito</h1>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Lista de items */}
          <section className="space-y-4 rounded-2xl bg-stone-900 p-5">
            {items.map((item) => {
              const img = getItemImage(item);
              const unitPrice = priceWithDiscount(item);
              const qty = Number(item.qty) || 1;
              const lineTotal = unitPrice * qty;

              return (
                <article
                  key={item.id}
                  className="flex gap-4 border-b border-stone-800 pb-4 last:border-b-0 last:pb-0"
                >
                  <Link
                    to={`/product/${item.id}`}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-stone-800"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-sm font-semibold hover:underline"
                        >
                          {item.name || item.title || "Producto"}
                        </Link>
                        {item.brand && (
                          <p className="text-xs text-stone-400">
                            {item.brand}
                          </p>
                        )}
                      </div>

                      <div className="text-right text-sm">
                        <div className="font-semibold">
                          {fmt(unitPrice)} c/u
                        </div>
                        {item.discount ? (
                          <div className="text-xs text-emerald-400">
                            {item.discount}% OFF
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      {/* Controles de cantidad */}
                      <div className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-2 py-1">
                        <button
                          type="button"
                          className="px-2 text-lg leading-none disabled:opacity-40"
                          onClick={() => handleDecrement(item.id, qty)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          className="w-14 bg-transparent text-center text-sm outline-none"
                          value={qty}
                          onChange={(e) =>
                            handleChangeQty(item.id, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="px-2 text-lg leading-none"
                          onClick={() => handleIncrement(item.id, qty)}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">
                          {fmt(lineTotal)}
                        </span>
                        <button
                          type="button"
                          className="text-xs text-stone-400 hover:text-red-400"
                          onClick={() => removeOne(item.id)}
                        >
                          Quitar 1
                        </button>
                        <button
                          type="button"
                          className="text-xs text-stone-400 hover:text-red-400"
                          onClick={() => removeAll(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Resumen */}
          <aside className="rounded-2xl bg-stone-900 p-5">
            <h2 className="mb-4 text-lg font-semibold">Resumen</h2>

            <div className="mb-4 flex items-center justify-between text-sm">
              <span>Total ({items.length} ítem/s)</span>
              <span className="text-base font-semibold">{fmt(total)}</span>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="mb-3 w-full rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-200 transition hover:bg-stone-800"
            >
              Vaciar carrito
            </button>

            <button
              type="button"
              disabled={!items.length}
              onClick={handleCheckout}
              className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-black transition hover:brightness-105 disabled:opacity-50"
            >
              Continuar al pago
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

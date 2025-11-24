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

  // IMAGEN confiable por item
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

  const handleChangeQty = (id, v) => {
    const qty = Math.max(1, Number(v) || 1);
    setCartQty(id, qty);
  };

  const handleCheckout = () => {
    if (!items.length) return;
    if (!isAuth) {
      nav("/login?redirect=/cart");
      return;
    }
    nav("/checkout");
  };

  return (
    <main className="bg-background-light text-white dark:bg-background-dark min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Migas */}
        <p className="text-sm text-stone-400">
          <Link to="/catalog" className="hover:text-primary">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          Carrito
        </p>

        <h1 className="mt-2 text-4xl font-extrabold">Carrito de compras</h1>

        {/* Layout principal */}
        <div className="mt-10 grid gap-8 lg:[grid-template-columns:minmax(0,1fr)_360px]">

          {/* LISTA */}
          <aside className="lg:col-start-1">
            <section>
              {items.length ? (
                <ul className="divide-y divide-white/10">
                  {items.map((item) => {
                    const img = getItemImage(item);
                    const qty = Number(item.qty) || 1;
                    const unit = priceWithDiscount(item);
                    const lineTotal = unit * qty;

                    return (
                      <li
                        key={item.id}
                        className="py-6 first:border-t first:border-white/10"
                      >
                        <div className="grid grid-cols-[96px,1fr,auto] items-center gap-6">
                          {/* Imagen */}
                          <Link
                            to={`/product/${item.id}`}
                            className="h-24 w-24 overflow-hidden rounded-lg bg-stone-800"
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

                          {/* Info */}
                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/product/${item.id}`}
                              className="text-lg font-semibold hover:text-primary"
                            >
                              {item.name}
                            </Link>

                            <div className="mt-1 flex items-center gap-3">

                              {/* Botón – */}
                              <button
                                onClick={() =>
                                  setCartQty(item.id, Math.max(1, qty - 1))
                                }
                                className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                              >
                                −
                              </button>

                              {/* Input cantidad */}
                              <input
                                value={qty}
                                onChange={(e) =>
                                  handleChangeQty(item.id, e.target.value)
                                }
                                className="w-12 rounded-md border border-primary/20 bg-transparent p-1 text-center"
                                type="number"
                                min={1}
                              />

                              {/* Botón + */}
                              <button
                                onClick={() => setCartQty(item.id, qty + 1)}
                                className="flex items-center justify-center h-8 w-8 rounded-full ring-1 ring-primary/30 hover:bg-primary/20"
                              >
                                +
                              </button>

                              {/* Quitar */}
                              <button
                                onClick={() => removeAll(item.id)}
                                className="ml-3 text-sm text-stone-400 hover:text-primary"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          {/* Precio */}
                          <p className="text-right text-lg font-semibold">
                            {fmt(lineTotal)}
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

          {/* RESUMEN */}
          <aside className="lg:col-start-2 h-max rounded-xl border border-primary/20 bg-primary/5 p-6 sticky top-24">
            <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-300">Subtotal</span>
                <span className="font-medium">{fmt(total)}</span>
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
              <span>{fmt(total)}</span>
            </div>

            {/* Botón pagar */}
            <button
              disabled={!items.length}
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:opacity-50"
            >
              Continuar al pago
            </button>

            {/* Vaciar carrito */}
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="mt-4 w-full text-sm text-stone-400 hover:text-red-300"
              >
                Vaciar carrito
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

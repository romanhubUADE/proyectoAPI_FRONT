import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(n || 0));

// ---- prevalidación de stock en cliente ----
async function checkStockBeforeOrder(items, state) {
  const problems = [];
  for (const it of items) {
    // 1) intento con cache/store
    let p = state.products?.find((x) => String(x.id) === String(it.id));
    // 2) si no está, pido al back
    if (!p) {
      try {
        p = await api.getProduct(it.id);
      } catch {
        // si falla el GET, no bloqueamos por esto
      }
    }
    if (!p) continue;

    const want = it.qty || 1;
    const have = Number(p.stock ?? 0);
    if (have < want) {
      problems.push({
        id: p.id,
        name: p.name || `Producto ${p.id}`,
        want,
        have,
      });
    }
  }
  return problems;
}

export default function CheckoutFinal() {
  const { state, dispatch, priceWithDiscount } = useShop();
  const { isAuth } = useAuth();
  const nav = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const items = state.cart ?? [];
  const subtotal = useMemo(
    () => items.reduce((t, it) => t + priceWithDiscount(it) * (it.qty || 1), 0),
    [items, priceWithDiscount]
  );

  // datos persistidos
  const rawMethod = localStorage.getItem("payment.method") || "";
  const last4 = localStorage.getItem("payment.last4") || "";
  const store = sessionStorage.getItem("checkout.store") || "A confirmar en sucursal";
  const email = sessionStorage.getItem("checkout.email") || "—";

  const methodMap = {
    credit: "credit",
    debit: "debit",
    cash: "cash",
    credito: "credit",
    debito: "debit",
    efectivo: "cash",
  };
  const method = methodMap[rawMethod] || "cash";

  const methodLabel =
    method === "cash"
      ? "Efectivo al entregar"
      : `Tarjeta ${method === "debit" ? "de débito" : "de crédito"}${
          last4 ? ` terminada en ${last4}` : ""
        }`;

  const onConfirm = async () => {
    setErr("");

    if (!isAuth) {
      nav("/login?next=/checkout/final");
      return;
    }

    // 0) carrito vacío
    if (!items.length) {
      setErr("El carrito está vacío.");
      return;
    }

    // 1) prevalidación de stock
    const issues = await checkStockBeforeOrder(items, state);
    if (issues.length) {
      const msg = issues
        .map((it) => `• ${it.name}: pediste ${it.want}, stock ${it.have}`)
        .join("\n");
      setErr(`No se pudo confirmar la compra: stock insuficiente.\n${msg}`);
      return;
    }

    // 2) payload al back
    const payload = {
      items: items.map((it) => ({
        productId: it.id,
        quantity: it.qty || 1,
      })),
    };

    try {
      setSubmitting(true);
      await api.createOrder(payload);

      // éxito → limpiar
      dispatch({ type: "CLEAR" });
      localStorage.removeItem("payment.method");
      localStorage.removeItem("payment.last4");
      sessionStorage.removeItem("checkout.store");
      sessionStorage.removeItem("checkout.email");
      sessionStorage.removeItem("checkout.name");
      sessionStorage.removeItem("checkout.last");

      if (typeof Swal !== "undefined") {
        await Swal.fire({
          title: "¡Compra realizada!",
          text: "Tu pedido fue confirmado con éxito.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#b86614",
          background: "#2c1f13ff",
          color: "#f8f7f6",
          backdrop: "rgba(0,0,0,0.6)",
        });
      }
      nav("/account");
    } catch (e) {
      console.error("createOrder failed:", e?.status, e?.body || e);
      const status = e?.status || 0;
      const msg = (e?.body?.message || e?.message || "").toLowerCase();

      // si el back igualmente mandó texto de stock, lo mostramos
      if (msg.includes("stock") || msg.includes("insuficien")) {
        setErr(e?.body?.message || "No se pudo confirmar la compra: stock insuficiente.");
        return;
      }

      if (status === 401 || status === 403) {
        setErr("Tu sesión expiró. Iniciá sesión para finalizar la compra.");
        return;
      }

      setErr(e?.body?.message || e?.message || "No se pudo confirmar la compra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background-light text-white dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <h1 className="text-4xl font-extrabold">Checkout</h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          {/* Columna izquierda */}
          <section>
            <h2 className="mb-4 border-b border-primary/20 pb-2 text-xl font-semibold dark:border-primary/30">
              Resumen del pedido
            </h2>

            <ul className="divide-y divide-primary/20 dark:divide-primary/30">
              {items.map((it) => {
                const img = it.image || it.images?.[0];
                const totalItem = priceWithDiscount(it) * (it.qty || 1);
                return (
                  <li key={it.id} className="py-4">
                    <div className="grid grid-cols-[80px,1fr,auto] items-center gap-4">
                      <Link to={`/product/${it.id}`} className="h-20 w-20 overflow-hidden rounded-lg bg-stone-800">
                        {img ? <img src={img} alt={it.name} className="h-full w-full object-cover" /> : null}
                      </Link>

                      <div>
                        <Link to={`/product/${it.id}`} className="font-semibold hover:text-primary">
                          {it.name}
                        </Link>
                        <p className="text-sm text-stone-400">
                          {it.category} · Cant: {it.qty || 1}
                        </p>
                      </div>

                      <div className="text-right font-semibold">{fmt(totalItem)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 space-y-2 border-t border-primary/20 pt-4 dark:border-primary/30">
              <div className="flex justify-between text-base">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-2 text-lg font-bold dark:border-primary/30">
                <span>Total</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {method === "cash" && (
                <p className="text-sm text-amber-300/90">
                  Recordá tener billetes en buen estado y, en lo posible, el monto justo.
                </p>
              )}
            </div>
          </section>

          {/* Columna derecha */}
          <aside>
            <section className="space-y-6">
              <div>
                <h3 className="mb-3 border-b border-primary/20 pb-2 text-xl font-semibold dark:border-primary/30">
                  Retiro en sucursal
                </h3>
                <div className="rounded-lg border border-primary/20 p-4 dark:border-primary/30">
                  <p className="text-sm text-stone-300">Sucursal</p>
                  <p className="font-medium">{store}</p>
                  <p className="mt-2 text-sm text-stone-300">Contacto</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 border-b border-primary/20 pb-2 text-xl font-semibold dark:border-primary/30">
                  Método de pago
                </h3>
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4 dark:bg-primary/20">
                  <p className="font-medium">{methodLabel}</p>
                  <Link to="/payment" className="text-sm text-primary hover:opacity-90">
                    Cambiar
                  </Link>
                </div>
              </div>

              {err && (
                <p className="whitespace-pre-line rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {err}
                </p>
              )}

              <button
                onClick={onConfirm}
                disabled={submitting}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? "Procesando..." : "Confirmar pedido"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

// src/pages/Payment.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number(n || 0));

export default function Payment() {
  const nav = useNavigate();
  const { state, priceWithDiscount } = useShop();

  const items = state.cart ?? [];
  const total = items.reduce((t, i) => t + priceWithDiscount(i) * i.qty, 0);

  const [method, setMethod] = useState("credit"); // "credit" | "debit" | "cash"
  const [card, setCard] = useState({ number: "", exp: "", cvv: "", name: "" });

 // Payment.jsx
const submit = (e) => {
  e.preventDefault();
  if (!items.length) return;

  // normaliza método: "credit" | "debit" | "cash"
  const m = method;

  // toma últimos 4 si es tarjeta
  const last4 =
    m === "cash"
      ? ""
      : (card.number || "").replace(/\D/g, "").slice(-4);

  localStorage.setItem("payment.method", m);
  localStorage.setItem("payment.last4", last4);

  nav("/checkout-final");
};



  return (
    <div className="flex min-h-[80vh] items-start justify-center">
      <main className="w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Método de pago</h1>

        <form onSubmit={submit} className="space-y-8">
          {/* Métodos */}
          <div className="space-y-3">
            {[
              { id: "credit", label: "Crédito" },
              { id: "debit", label: "Débito" },
              { id: "cash",  label: "Efectivo al entregar" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-4 ${
                  method === opt.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-white/10 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="method"
                    value={opt.id}
                    checked={method === opt.id}
                    onChange={() => setMethod(opt.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm">{opt.label}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Contenido por método */}
          {method === "cash" ? (
            <div className="rounded-lg border border-white/10 p-5">
              <div className="mb-3 flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
              <p className="text-sm opacity-80">
                Recordá tener billetes en buen estado y pagar justo en lo posible.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm opacity-80">Número de tarjeta</label>
                <input
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-3"
                  required={method !== "cash"}
                  disabled={method === "cash"}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm opacity-80">Vencimiento</label>
                  <input
                    placeholder="MM/AA"
                    value={card.exp}
                    onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-3"
                    required={method !== "cash"}
                    disabled={method === "cash"}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm opacity-80">CVV</label>
                  <input
                    placeholder="123"
                    value={card.cvv}
                    onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-3"
                    required={method !== "cash"}
                    disabled={method === "cash"}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm opacity-80">Nombre en la tarjeta</label>
                  <input
                    placeholder="Nombre y Apellido"
                    value={card.name}
                    onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-3"
                    required={method !== "cash"}
                    disabled={method === "cash"}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!items.length}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            Confirmar pago
          </button>
        </form>
      </main>
    </div>
  );
}

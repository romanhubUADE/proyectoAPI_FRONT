import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  resetCreateStatus,
} from "../redux/ordersSlice.js";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function CheckoutFinal() {
  const nav = useNavigate();
  const { cart, clearCart } = useShop();
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();

  const {
    createStatus,
    createError,
    lastCreated,
  } = useSelector((s) => s.orders);

  // Datos del checkout (obtenidos del paso anterior)
  const [customer, setCustomer] = useState({
    email: "",
    store: "",
    name: "",
    last: "",
  });

  useEffect(() => {
    setCustomer({
      email: sessionStorage.getItem("checkout.email") || "",
      store: sessionStorage.getItem("checkout.store") || "",
      name: sessionStorage.getItem("checkout.name") || "",
      last: sessionStorage.getItem("checkout.last") || "",
    });
  }, []);

  // Calcular el total del carrito
  const total = useMemo(
    () => cart.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0),
    [cart]
  );

  // Si el admin intenta comprar → bloquear
  useEffect(() => {
    if (isAdmin) {
      Swal.fire({
        title: "Acción no permitida",
        text: "Los administradores no pueden realizar compras.",
        icon: "warning",
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#b86614",
        background: "#2c1f13ff",
        color: "#f8f7f6",
        backdrop: "rgba(0,0,0,0.6)",
      }).then(() => nav("/"));
    }
  }, [isAdmin, nav]);

  const paying = createStatus === "loading";

  const handlePayment = async () => {
    if (!cart.length) return;

    const payload = {
      customer: {
        name: customer.name,
        last: customer.last,
        email: customer.email,
        store: customer.store,
      },
      items: cart.map((c) => ({
        productId: c.id,
        name: c.name,
        qty: c.qty,
        price: c.price,
      })),
      total,
    };

    await dispatch(createOrder(payload));
  };

  // Manejar resultado de la compra
  useEffect(() => {
    if (createStatus === "ready" && lastCreated) {
      Swal.fire({
        title: "Compra realizada",
        text: `Tu número de pedido es #${lastCreated.id || ""}`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#b86614",
        background: "#2c1f13ff",
        color: "#f8f7f6",
      }).then(() => {
        clearCart();
        dispatch(resetCreateStatus());
        nav("/account");
      });
    }

    if (createStatus === "error" && createError) {
      Swal.fire({
        title: "Error",
        text: createError,
        icon: "error",
        confirmButtonText: "OK",
        background: "#2c1f13ff",
        color: "#f8f7f6",
      }).then(() => dispatch(resetCreateStatus()));
    }
  }, [
    createStatus,
    createError,
    lastCreated,
    clearCart,
    nav,
    dispatch,
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-stone-100">
        Confirmar compra
      </h1>

      <section className="rounded-xl bg-stone-900/60 p-6 ring-1 ring-stone-700">
        <h2 className="mb-4 text-lg font-semibold text-stone-200">
          Detalles del pedido
        </h2>

        <div className="grid gap-4 text-sm text-stone-300">
          <p>
            <strong>Nombre:</strong> {customer.name} {customer.last}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Sucursal:</strong> {customer.store}
          </p>
        </div>

        <h3 className="mt-6 mb-2 text-lg font-semibold text-stone-200">
          Carrito
        </h3>

        <ul className="space-y-3 text-sm text-stone-300">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-stone-700 pb-2 last:border-none"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{fmt(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-stone-700 pt-4 text-base">
          <span className="font-semibold text-stone-200">Total</span>
          <span className="font-bold text-amber-400">{fmt(total)}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-stone-900 hover:bg-primary/80 disabled:opacity-60"
        >
          {paying ? "Procesando…" : "Confirmar compra"}
        </button>
      </section>
    </div>
  );
}
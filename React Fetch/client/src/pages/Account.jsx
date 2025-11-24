// src/pages/Account.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/ordersSlice.js";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const fmtDate = (v) => {
  if (!v) return "Fecha desconocida";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString("es-AR");
};

export default function Account() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const dispatch = useDispatch();

  // nombre y email desde el JWT
  const email = user?.sub || user?.email || "usuario@desconocido";

  const name = useMemo(() => {
    const fn = user?.firstName || user?.given_name;
    const ln = user?.lastName || user?.family_name;
    if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
    return String(email).split("@")[0] || "Usuario";
  }, [user, email]);

  const initials = useMemo(() => {
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

  // Redux: mis compras
  const { mine, mineStatus, mineError } = useSelector((s) => s.orders);

  useEffect(() => {
    if (mineStatus === "idle") {
      dispatch(fetchMyOrders());
    }
  }, [mineStatus, dispatch]);

  const loading = mineStatus === "loading";
  const err = mineStatus === "error" ? mineError : "";

  const onLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="flex min-h-[70vh] items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Perfil */}
          <div className="rounded-xl bg-[#14100b] p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-stone-200 text-3xl font-semibold text-stone-700 dark:bg-stone-700 dark:text-white">
                {initials}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  {email}
                </p>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2">
                <Link
                  to="/account/edit"
                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-center text-sm dark:border-stone-700"
                >
                  Editar perfil
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full rounded-md bg-red-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Compras */}
          <div className="md:col-span-2 rounded-xl bg-[#14100b] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-100">
                Mis compras
              </h2>
            </div>

            {loading && (
              <p className="text-sm text-stone-400">Cargando compras…</p>
            )}

            {err && !loading && (
              <p className="text-sm text-red-400">
                Error al cargar tus compras: {err}
              </p>
            )}

            {!loading && !err && (
              <>
                {mine.length > 0 ? (
                  <ul className="space-y-4">
                    {mine.map((order, idx) => {
                      const id = order.id || order._id || idx;
                      const created =
                        order.createdAt || order.date || order.fecha;
                      const total =
                        order.total ||
                        order.totalAmount ||
                        order.totalPrice ||
                        0;
                      const items = Array.isArray(order.items)
                        ? order.items
                        : Array.isArray(order.detalles)
                        ? order.detalles
                        : [];

                      return (
                        <li
                          key={id}
                          className="rounded-lg border border-stone-700 bg-stone-900/60 p-4 text-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-xs text-stone-400">
                                Pedido
                              </p>
                              <p className="text-sm font-semibold text-stone-100">
                                #{id}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-stone-400">
                                Fecha
                              </p>
                              <p className="text-sm text-stone-200">
                                {fmtDate(created)}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-stone-400">
                                Total
                              </p>
                              <p className="text-sm font-semibold text-amber-400">
                                {fmt(total)}
                              </p>
                            </div>
                          </div>

                          {items.length > 0 && (
                            <div className="mt-3 border-t border-stone-800 pt-3">
                              <p className="mb-1 text-xs font-semibold text-stone-400">
                                Productos
                              </p>
                              <ul className="space-y-1 text-xs text-stone-300">
                                {items.map((it, i2) => (
                                  <li key={i2} className="flex justify-between">
                                    <span>
                                    {it.productName || it.product?.name || it.name || "Producto"}

                                    </span>
                                    <span className="text-stone-400">
                                    x{it.quantity || it.qty || 1}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="rounded-md border border-stone-700 p-6 text-stone-300">
                    No tenés compras aún.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

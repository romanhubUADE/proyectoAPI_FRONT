import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    .format(Number(n || 0));

export default function Account() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // nombre y email reales desde el JWT
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

  // cargar “mis compras”
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await api.myOrders(); // GET /api/compras/mias
        if (!alive) return;
        setOrders(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Error cargando tus compras");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onLogout = () => { logout(); nav("/"); };

  return (
    <div className="flex min-h-[70vh] items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Perfil */}
          <div className="rounded-xl bg-[#14100b] p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-stone-100 text-2xl font-semibold text-stone-700 dark:bg-stone-700 dark:text-white">
                {initials}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{name}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">{email}</p>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2">
                <Link
                  to="/account/edit"
                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-center text-sm dark:border-stone-700"
                >
                  Editar perfil
                </Link>
                <button onClick={onLogout} className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Mis compras */}
          <div className="md:col-span-2 rounded-xl bg-[#14100b] p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-white">Mis compras</h3>

            {loading && <div className="text-stone-300">Cargando…</div>}
            {err && !loading && <div className="text-red-400">{err}</div>}

            {!loading && !err && (
              orders.length ? (
                <ul className="space-y-3">
                  {orders.map(o => (
                    <li key={o.id} className="rounded-md border border-stone-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-stone-300">Orden #{o.id}</div>
                        <div className="text-sm font-semibold">{fmt(o.total)}</div>
                      </div>
                      <div className="mt-2 text-xs text-stone-400">
                        {o.date ?? ""}
                      </div>

                      {/* Ítems */}
                      <div className="mt-3 divide-y divide-white/10 rounded-md border border-white/10">
                        {(o.items || []).map((it, idx) => (
                          <div key={idx} className="grid grid-cols-[1fr,auto,auto] gap-3 px-3 py-2 text-sm">
                            <div className="truncate">{it.productName}</div>
                            <div className="text-right">x{it.quantity}</div>
                            <div className="text-right">{fmt(it.lineTotal ?? (it.priceUnit * it.quantity))}</div>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-stone-700 p-6 text-stone-300">
                  No tenés compras aún.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

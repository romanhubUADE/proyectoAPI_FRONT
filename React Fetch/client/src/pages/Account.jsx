import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user, logout } = useAuth(); // user viene del JWT decodificado
  const nav = useNavigate();

  // Deriva nombre y email reales desde el token
  const email = user?.sub || user?.email || "usuario@desconocido";
  const name = useMemo(() => {
    const fn = user?.firstName || user?.given_name;
    const ln = user?.lastName || user?.family_name;
    if (fn || ln) return [fn, ln].filter(Boolean).join(" ");
    // fallback: nombre a partir del email
    return String(email).split("@")[0] || "Usuario";
  }, [user, email]);

  // Iniciales para el avatar
  const initials = useMemo(() => {
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

  const onLogout = () => {
    logout();
    nav("/"); // redirige al home
  };

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
                {/* Si luego sumás "memberSince" real, reemplaza esta línea */}
                {/* <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Miembro desde 2024</p> */}
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
                  className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Info / Pedidos / Preferencias */}
          <div className="md:col-span-2 rounded-xl bg-[#14100b] p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-white">Mi cuenta</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-stone-100 p-4 dark:border-stone-700">
                <div>
                  <p className="text-sm text-stone-600 dark:text-stone-300">Dirección por defecto</p>
                  <p className="mt-1 text-sm font-medium text-stone-900 dark:text-white">No hay dirección registrada</p>
                </div>
                <Link to="/account/addresses" className="text-sm text-primary hover:underline">Gestionar</Link>
              </div>

              <div className="flex items-center justify-between rounded-md border border-stone-100 p-4 dark:border-stone-700">
                <div>
                  <p className="text-sm text-stone-600 dark:text-stone-300">Pedidos recientes</p>
                  <p className="mt-1 text-sm font-medium text-stone-900 dark:text-white">No hay pedidos recientes</p>
                </div>
                <Link to="/orders" className="text-sm text-primary hover:underline">Ver pedidos</Link>
              </div>

              <div className="rounded-md border border-stone-100 p-4 dark:border-stone-700">
                <p className="text-sm text-stone-600 dark:text-stone-300">Preferencias</p>
                <div className="mt-3 flex gap-3">
                  <button className="rounded-md border border-stone-200 px-3 py-1 text-sm text-black dark:text-black dark:border-stone-700">
                    Email
                  </button>
                  <button className="rounded-md border border-stone-200 px-3 py-1 text-sm text-black dark:text-black dark:border-stone-700">
                    SMS
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

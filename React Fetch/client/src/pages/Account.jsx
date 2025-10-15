// src/pages/Account.jsx
import { Link } from "react-router-dom";

export default function Account() {
  // Temporal: datos de ejemplo. Reemplazar con datos reales del contexto auth cuando exista.
  const user = { name: "Usuario Ejemplo", email: "usuario@ejemplo.com", memberSince: "2024" };

  return (
    <div className="flex min-h-[70vh] items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Perfil */}
          <div className="rounded-xl bg-white/90 p-6 shadow-md dark:bg-stone-900/90">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-stone-100 text-2xl font-semibold text-stone-700 dark:bg-stone-700 dark:text-white">
                {user.name.split(" ").map(n => n[0]).slice(0,2).join("")}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">{user.email}</p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Miembro desde {user.memberSince}</p>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2">
                <Link to="/account/edit" className="w-full rounded-md border border-stone-200 px-3 py-2 text-center text-sm dark:border-stone-700">Editar perfil</Link>
                <button className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">Cerrar sesión</button>
              </div>
            </div>
          </div>

          {/* Info / Pedidos / Preferencias */}
          <div className="md:col-span-2 rounded-xl bg-white/90 p-6 shadow-md dark:bg-stone-900/90">
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

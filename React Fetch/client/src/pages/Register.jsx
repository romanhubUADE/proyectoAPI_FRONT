// src/pages/Register.jsx
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">Crea tu cuenta</h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">Regístrate para acceder a ventas, listas y tu cuenta</p>

          <form className="grid gap-6">
            <div>
              <label className="block text-sm text-stone-700 dark:text-stone-200">Nombre completo</label>
              <input type="text" required className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100" placeholder="Tu nombre" />
            </div>

            <div>
              <label className="block text-sm text-stone-700 dark:text-stone-200">E-mail</label>
              <input type="email" required className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100" placeholder="tu@ejemplo.com" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">Contraseña</label>
                <input type="password" required className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">Confirmar contraseña</label>
                <input type="password" required className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
              Crear cuenta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

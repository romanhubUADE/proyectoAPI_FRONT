// src/pages/Login.jsx
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">Bienvenido de nuevo</h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">Inicia sesión con tu cuenta para continuar</p>

          <form className="space-y-6">
            <label className="block">
              <span className="text-sm text-stone-700 dark:text-stone-200">E-mail</span>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="tu@ejemplo.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-stone-700 dark:text-stone-200">Contraseña</span>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="••••••••"
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <input type="checkbox" className="h-4 w-4 rounded border-stone-300 bg-white text-primary focus:ring-primary" />
                <span>Recordarme</span>
              </label>
              <Link to="#" className="text-sm text-primary hover:underline">¿Olvidaste la contraseña?</Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

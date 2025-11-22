// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, status, error, isAuth } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [localError, setLocalError] = useState("");

  const loading = status === "loading";

  // precarga email si se marcó "Recordarme" antes
  useEffect(() => {
    const saved = localStorage.getItem("remember_email");
    if (saved) {
      setForm((f) => ({ ...f, email: saved }));
      setRemember(true);
    }
  }, []);

  // si se loguea con éxito, redirige
  useEffect(() => {
    if (isAuth) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuth, location, navigate]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setLocalError("");
  };

  const onChangeRemember = (e) => {
    setRemember(e.target.checked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.email || !form.password) {
      setLocalError("Completá email y contraseña.");
      return;
    }

    // dispara thunk loginUser a través del AuthContext
    await login(form.email, form.password);

    // si recordarme está activo, guardamos email
    if (remember) localStorage.setItem("remember_email", form.email);
    else localStorage.removeItem("remember_email");
  };

  const displayError = localError || error;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">
            Bienvenido de nuevo
          </h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">
            Iniciá sesión con tu cuenta para continuar
          </p>

          {displayError && (
            <div className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {displayError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block text-stone-700 dark:text-stone-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="vos@ejemplo.com"
                value={form.email}
                onChange={onChangeInput}
              />
            </div>

            <div>
              <label className="mb-1 block text-stone-700 dark:text-stone-200">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="••••••••"
                value={form.password}
                onChange={onChangeInput}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 bg-white text-primary focus:ring-primary"
                  checked={remember}
                  onChange={onChangeRemember}
                />
                <span>Recordarme</span>
              </label>
              <Link to="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 disabled:opacity-60"
            >
              {loading ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

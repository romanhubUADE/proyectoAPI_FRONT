// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // precarga email si se marcó "Recordarme" antes
  useEffect(() => {
    const saved = localStorage.getItem("remember_email");
    if (saved) {
      setForm((f) => ({ ...f, email: saved }));
      setRemember(true);
    }
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setRemember(checked);
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await api.login({
        email: form.email,
        password: form.password,
      });
      // guarda token en AuthContext + localStorage
      login(accessToken);

      // persiste email si "Recordarme" está activo
      if (remember) localStorage.setItem("remember_email", form.email);
      else localStorage.removeItem("remember_email");

      // redirige a ruta previa o a /account
      const to = location.state?.from || "/account";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">
            Bienvenido de nuevo
          </h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">
            Inicia sesión con tu cuenta para continuar
          </p>

          <form className="space-y-6" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-sm text-stone-700 dark:text-stone-200">E-mail</span>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="tu@ejemplo.com"
                value={form.email}
                onChange={onChange}
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
                value={form.password}
                onChange={onChange}
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 bg-white text-primary focus:ring-primary"
                  checked={remember}
                  onChange={onChange}
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
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {error && <p className="text-center text-red-500 text-sm">{error}</p>}
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

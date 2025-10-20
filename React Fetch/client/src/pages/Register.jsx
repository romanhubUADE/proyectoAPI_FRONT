// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const dto = {
        firstName: form.firstName.split(" ")[0] || form.firstName,
        lastName: form.lastName.split(" ")[1] || "",
        email: form.email,
        password: form.password,
        role: "USER",
      };
      const { accessToken } = await api.register(dto);
      login(accessToken); // guarda token en localStorage
      navigate("/account"); // redirige
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">
            Crea tu cuenta
          </h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">
            Regístrate para acceder a ventas, listas y tu cuenta
          </p>

          <form onSubmit={onSubmit} className="grid gap-6">
            <div>
              <label className="block text-sm text-stone-700 dark:text-stone-200">
                Nombre completo
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="Tu nombre"
                value={form.firstName}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="block text-sm text-stone-700 dark:text-stone-200">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="tu@ejemplo.com"
                value={form.email}
                onChange={onChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirm"
                  required
                  className="mt-1 block w-full rounded-md border border-stone-200 px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={onChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
            ¿Ya tenés una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

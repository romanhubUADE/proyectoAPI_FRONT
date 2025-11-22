// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register, login, registerStatus, registerError, isAuth } =
    useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [localError, setLocalError] = useState("");

  const loading = registerStatus === "loading";

  // si ya está logueado, mandamos a /account
  useEffect(() => {
    if (isAuth) navigate("/account", { replace: true });
  }, [isAuth, navigate]);

  // después de un registro exitoso → intentar login automático
  useEffect(() => {
    if (registerStatus === "ready") {
      (async () => {
        try {
          await login(form.email, form.password);
          navigate("/account", { replace: true });
        } catch {
          // si falla el login automático, se puede manejar aparte
        }
      })();
    }
  }, [registerStatus, form.email, form.password, login, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setLocalError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.firstName || !form.email || !form.password) {
      setLocalError("Completá todos los campos obligatorios.");
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    const dto = {
      firstName: form.firstName.split(" ")[0] || form.firstName,
      lastName: form.lastName || "",
      email: form.email,
      password: form.password,
      role: "USER",
    };

    await register(dto);
  };

  const displayError = localError || registerError;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <div className="rounded-xl bg-[#14100b] p-6">
          <h2 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-white">
            Crear cuenta
          </h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-300">
            Registrate para empezar a comprar en String &amp; Soul
          </p>

          {displayError && (
            <div className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {displayError}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  placeholder="Tu nombre"
                  value={form.firstName}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="block text-sm text-stone-700 dark:text-stone-200">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  placeholder="Tu apellido"
                  value={form.lastName}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-stone-700 dark:text-stone-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                placeholder="vos@ejemplo.com"
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
                  className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
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
                  className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-primary focus:ring-primary dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  placeholder="Repetí la contraseña"
                  value={form.confirm}
                  onChange={onChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 disabled:opacity-60"
            >
              {loading ? "Creando cuenta…" : "Registrarme"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

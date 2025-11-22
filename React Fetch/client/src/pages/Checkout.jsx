import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  // AHORA solo usamos cart del contexto, no state/dispatch
  const { cart } = useShop();
  const nav = useNavigate();
  const { isAdmin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    store: "",
    name: "",
    last: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;

    // impedir que un admin realice compras
    if (isAdmin) {
      await Swal.fire({
        title: "Acción no permitida",
        text: "Los administradores no pueden realizar compras.",
        icon: "warning",
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#b86614",
        background: "#2c1f13ff",
        color: "#f8f7f6",
        backdrop: "rgba(0,0,0,0.6)",
      });
      nav("/");
      return;
    }

    // Guardar datos del formulario para usarlos en /payment
    sessionStorage.setItem("checkout.email", form.email);
    sessionStorage.setItem("checkout.store", form.store);
    sessionStorage.setItem("checkout.name", form.name);
    sessionStorage.setItem("checkout.last", form.last);

    nav("/payment");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:flex-row">
      {/* Columna izquierda: resumen del carrito */}
      <aside className="w-full rounded-2xl bg-stone-100 p-6 text-stone-900 shadow-lg dark:bg-stone-900 dark:text-stone-50 lg:w-2/5">
        <h2 className="mb-4 text-lg font-semibold">Tu carrito</h2>

        {cart.length === 0 ? (
          <p className="text-sm text-stone-500">
            No tenés productos en el carrito.
          </p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3 text-sm last:border-none dark:border-stone-700"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    Cantidad: {item.qty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.price}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Columna derecha: formulario */}
      <main className="w-full max-w-3xl rounded-2xl bg-stone-950/60 p-4 text-stone-50 shadow-lg ring-1 ring-stone-800 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold">Información</h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          {/* Contacto */}
          <section>
            <h2 className="text-xl font-semibold">Contacto</h2>
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="mt-3 w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <label className="mt-3 flex items-center gap-2 text-sm opacity-80">
              <input type="checkbox" className="h-4 w-4 rounded" />
              Mantenerme al día sobre ofertas.
            </label>
          </section>

          {/* Datos personales */}
          <section>
            <h2 className="text-xl font-semibold">Datos personales</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                required
                placeholder="Apellido"
                value={form.last}
                onChange={(e) =>
                  setForm({ ...form, last: e.target.value })
                }
                className="w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </section>

          {/* Retiro en sucursal */}
          <section>
            <h2 className="text-xl font-semibold">Retiro</h2>
            <select
              required
              value={form.store}
              onChange={(e) =>
                setForm({ ...form, store: e.target.value })
              }
              className="mt-3 w-full rounded-lg border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="" disabled>
                Seleccioná una sucursal
              </option>
              <option value="nunez">Núñez</option>
              <option value="palermo">Palermo</option>
              <option value="microcentro">Microcentro</option>
            </select>
          </section>

          <button
            type="submit"
            disabled={!cart.length}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/80 disabled:opacity-50"
          >
            Continuar al pago
          </button>
        </form>
      </main>
    </div>
  );
}
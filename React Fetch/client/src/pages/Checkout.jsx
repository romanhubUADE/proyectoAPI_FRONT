import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // 🔸 agregado

export default function Checkout() {
  const { state, dispatch } = useShop();
  const nav = useNavigate();
  const { isAdmin } = useAuth(); // 🔸 agregado
  const [form, setForm] = useState({ email: "", store: "", name: "", last: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!state.cart.length) return;

    // 🔸 Nueva validación: impedir que un admin realice compras
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
      nav("/"); // Redirige al menú principal
      return;
    }

    // Guardar datos del formulario
    sessionStorage.setItem("checkout.email", form.email);
    sessionStorage.setItem("checkout.store", form.store);
    sessionStorage.setItem("checkout.name", form.name);
    sessionStorage.setItem("checkout.last", form.last);

    nav("/payment");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <main className="w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold">Información</h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold">Contacto</h2>
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-3 w-full rounded-lg border bg-transparent px-4 py-3"
            />
            <label className="mt-3 flex items-center gap-2 text-sm opacity-80">
              <input type="checkbox" className="h-4 w-4 rounded" />
              Mantenerme al día sobre ofertas.
            </label>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Retiro en Sucursal</h2>
            <select
              required
              value={form.store}
              onChange={(e) => setForm({ ...form, store: e.target.value })}
              className="mt-3 w-full rounded-lg border bg-transparent px-4 py-3"
            >
              <option value="" disabled>
                Seleccione una sucursal
              </option>
              <option value="Centro">Centro</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border bg-transparent px-4 py-3"
              />
              <input
                required
                placeholder="Apellido"
                value={form.last}
                onChange={(e) => setForm({ ...form, last: e.target.value })}
                className="rounded-lg border bg-transparent px-4 py-3"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={!state.cart.length}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/80 disabled:opacity-50"
          >
            Continuar al pago
          </button>
        </form>
      </main>
    </div>
  );
}

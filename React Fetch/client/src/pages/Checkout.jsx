import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  const { cart, total } = useShop(); // ahora también usamos total para el resumen
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
    <main className="min-h-screen bg-background-light text-white dark:bg-background-dark">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Migas */}
        <p className="text-sm text-stone-400">
          <Link to="/cart" className="hover:text-primary">
            Carrito
          </Link>
          <span className="mx-2">/</span>
          Checkout
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Finalizar compra
        </h1>

        {/* Layout principal */}
        <div className="mt-8 grid gap-8 lg:[grid-template-columns:minmax(0,1.6fr)_minmax(280px,1fr)]">
          {/* FORMULARIO */}
          <section className="rounded-xl border border-white/10 bg-[#2c1f13] p-6 shadow-xl sm:p-7">

            <h2 className="text-lg font-semibold">Información del comprador</h2>
            <p className="mt-1 text-sm text-stone-400">
              Completá tus datos para continuar con el pago.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-8">
              {/* Contacto */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                  Contacto
                </h3>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tuemail@ejemplo.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-700 bg-stone-950/60 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder-stone-500 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <label className="mt-3 flex items-center gap-2 text-xs text-stone-400">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-stone-600 bg-stone-900"
                    />
                    Mantenerme al día sobre ofertas y novedades.
                  </label>
                </div>
              </section>

              {/* Datos personales */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                  Datos personales
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-700 bg-stone-950/60 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder-stone-500 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-300">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Apellido"
                      value={form.last}
                      onChange={(e) =>
                        setForm({ ...form, last: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-700 bg-stone-950/60 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder-stone-500 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Retiro en sucursal */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                  Retiro en sucursal
                </h3>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-stone-300">
                    Sucursal
                  </label>
                  <select
                    required
                    value={form.store}
                    onChange={(e) =>
                      setForm({ ...form, store: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-700 bg-stone-950/60 px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>
                      Seleccioná una sucursal
                    </option>
                    <option value="nunez">Núñez</option>
                    <option value="palermo">Palermo</option>
                    <option value="microcentro">Microcentro</option>
                  </select>
                  <p className="mt-2 text-xs text-stone-400">
                    Vas a poder retirar tu instrumento en la sucursal elegida
                    una vez confirmado el pago.
                  </p>
                </div>
              </section>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!cart.length}
                  className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-black shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continuar al pago
                </button>
              </div>
            </form>
          </section>

          {/* RESUMEN DEL CARRITO */}
          <aside className="h-max rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-4 text-lg font-bold">Resumen del pedido</h2>

            {cart.length === 0 ? (
              <div className="rounded-lg border border-white/10 p-4 text-sm text-stone-300">
                No tenés productos en el carrito.{" "}
                <Link to="/catalog" className="text-primary">
                  Volver a la tienda
                </Link>
              </div>
            ) : (
              <>
                <ul className="mb-4 space-y-3 text-sm">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-stone-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          Cantidad: {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-stone-50">
                          ${item.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between text-stone-300">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ${Number(total || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Envío</span>
                    <span className="font-medium">Retiro en sucursal</span>
                  </div>
                </div>

                <div className="mt-4 h-px bg-primary/20" />

                <div className="mt-4 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>${Number(total || 0).toLocaleString()}</span>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

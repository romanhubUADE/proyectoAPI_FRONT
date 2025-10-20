import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../auth/RoleContext.jsx";

export default function AdminProducts() {
  const { role } = useRole();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  // seguridad extra (la ruta ya está protegida)
  if (role !== "ADMIN") return null;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("http://localhost:4002/products");
        const data = await r.json();
        if (!alive) return;
        setRows(Array.isArray(data) ? data : data.content ?? []);
      } catch {
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((p) =>
      [p.name, p.description, String(p.id)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [rows, q]);

  const del = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    const r = await fetch(`http://localhost:4002/products/${id}`, {
      method: "DELETE",
    });
    if (!r.ok) return alert("No se pudo eliminar");
    setRows((s) => s.filter((p) => p.id !== id));
  };

  const createNew = async () => {
    const body = {
      name: "Nuevo producto",
      description: "",
      longDescription: "",
      price: 0,
      stock: 0,
      specs: [],
      activo: true,
    };
    const r = await fetch("http://localhost:4002/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) return alert("No se pudo crear");
    const created = await r.json();
    navigate(`/admin/products/${created.id}/edit`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-white">Administrar productos</h1>

        <div className="flex w-full max-w-xl items-center gap-3 sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, descripción o ID…"
            className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={createNew}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Nuevo
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-stone-300">Cargando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-800">
          <table className="min-w-full divide-y divide-stone-800">
            <thead className="bg-stone-900/60">
              <tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th className="text-right">Precio</Th>
                <Th className="text-right">Stock</Th>
                <Th>Activo</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 bg-stone-900/30">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-900/60">
                  <Td>{p.id}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div className="max-w-[32ch] truncate">{p.name}</div>
                    </div>
                  </Td>
                  <Td className="text-right">${Number(p.price ?? 0).toLocaleString()}</Td>
                  <Td className="text-right">{p.stock ?? 0}</Td>
                  <Td>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        p.activo ? "bg-green-500/15 text-green-400" : "bg-stone-700 text-stone-300"
                      }`}
                    >
                      {p.activo ? "Sí" : "No"}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="rounded-md bg-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-100 hover:bg-stone-600"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => del(p.id)}
                        className="rounded-md bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-600/30"
                      >
                        Eliminar
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <Td colSpan={6} className="py-10 text-center text-stone-400">
                    No hay resultados.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

/* helpers visuales */
function Th({ children, className = "" }) {
  return (
    <th
      className={
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-300 " +
        className
      }
    >
      {children}
    </th>
  );
}
function Td({ children, className = "", colSpan }) {
  return (
    <td className={"px-4 py-3 text-sm text-stone-200 " + className} colSpan={colSpan}>
      {children}
    </td>
  );
}
// src/pages/AdminProducts.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  deleteProduct,
} from "../redux/productsSlice.js";

export default function AdminProducts() {
  const dispatch = useDispatch();

  const {
    items,
    status,
    error,
    deleteStatus,
    deleteError,
  } = useSelector((s) => s.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDelete = async (id, name) => {
    const ok = window.confirm(
      `¿Seguro que querés eliminar el producto "${name}"?`
    );
    if (!ok) return;

    await dispatch(deleteProduct(id));
    await dispatch(fetchProducts());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-stone-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Administrar productos
        </h1>

        <Link
          to="/admin/products/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
        >
          Nuevo producto
        </Link>
      </div>

      {status === "loading" && (
        <p className="text-stone-400">Cargando productos…</p>
      )}

      {status === "error" && (
        <p className="text-red-400">
          Error al cargar: {error}
        </p>
      )}

      {deleteStatus === "failed" && (
        <p className="text-red-400">
          Error al eliminar: {deleteError}
        </p>
      )}

      {status === "ready" && (
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-stone-800 text-stone-300">
            <tr>
              <th className="border border-stone-700 px-3 py-2">ID</th>
              <th className="border border-stone-700 px-3 py-2">Nombre</th>
              <th className="border border-stone-700 px-3 py-2">Precio</th>
              <th className="border border-stone-700 px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="odd:bg-stone-900 even:bg-stone-950">
                <td className="border border-stone-700 px-3 py-2">
                  {p.id}
                </td>
                <td className="border border-stone-700 px-3 py-2">
                  {p.name}
                </td>
                <td className="border border-stone-700 px-3 py-2">
                  ${p.price}
                </td>
                <td className="border border-stone-700 px-3 py-2 space-x-2">
                  <Link
                    to={`/admin/products/${p.id}`}
                    className="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-500"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="rounded bg-red-600 px-3 py-1 text-xs hover:bg-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

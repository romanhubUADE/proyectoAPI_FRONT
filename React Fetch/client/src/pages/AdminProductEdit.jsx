// src/pages/AdminProductEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductById,
  createProduct,
  updateProduct,
  uploadProductImages,
  clearCurrent,
  resetSaveStatus,
} from "../redux/productsSlice.js";

export default function AdminProductEdit() {
  const { id } = useParams();
  const creating = id === "new";
  const nav = useNavigate();
  const dispatch = useDispatch();

  const {
    current,
    currentStatus,
    currentError,
    saveStatus,
    saveError,
    uploadStatus,
    uploadError,
  } = useSelector((s) => s.products);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    if (!creating && id) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(clearCurrent());
    }
  }, [creating, id, dispatch]);

  useEffect(() => {
    if (!creating && current) {
      setForm({
        name: current.name ?? "",
        description: current.description ?? "",
        price: String(current.price ?? ""),
        category: current.category ?? "",
      });
    }
  }, [creating, current]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) return;

    if (creating) {
      await dispatch(createProduct(form));
    } else {
      await dispatch(updateProduct({ id, data: form }));
    }

    dispatch(resetSaveStatus());
    nav("/admin/products");
  };

  const onImages = async (e) => {
    const files = [...e.target.files];
    if (!files.length || !id || creating) return;
    await dispatch(uploadProductImages({ id, files }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-stone-100">
      <h1 className="mb-6 text-2xl font-semibold">
        {creating ? "Nuevo producto" : "Editar producto"}
      </h1>

      {currentStatus === "loading" && !creating && (
        <p className="mb-4 text-stone-400">Cargando producto…</p>
      )}
      {currentStatus === "error" && (
        <p className="mb-4 text-red-400">
          Error al cargar el producto: {currentError}
        </p>
      )}

      {saveStatus === "failed" && (
        <p className="mb-4 text-red-400">
          Error al guardar: {saveError}
        </p>
      )}

      {uploadStatus === "failed" && (
        <p className="mb-4 text-red-400">
          Error al subir imágenes: {uploadError}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Categoría</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        {!creating && (
          <div>
            <label className="mb-1 block text-sm">Imágenes</label>
            <input
              type="file"
              multiple
              onChange={onImages}
              className="w-full text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saveStatus === "loading"}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 disabled:opacity-60"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

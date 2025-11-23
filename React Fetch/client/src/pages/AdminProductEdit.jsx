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
import { fetchCategories } from "../redux/categoriesSlice.js";

export default function AdminProductEdit() {
  const { id } = useParams();
  // Crear si no hay id (ruta /admin/products/new) o si id === "new"
  const creating = !id || id === "new";

  console.log("ID desde useParams:", id);
  console.log("creating:", creating);

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

  const {
    items: categories,
    status: categoriesStatus,
    error: categoriesError,
  } = useSelector(
    (s) => s.categories || { items: [], status: "idle", error: null }
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    categoryId: "",
  });

  const [images, setImages] = useState([]);

  // Cargar categorías solo una vez
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  // Cargar producto si NO estamos creando
  useEffect(() => {
    if (!creating && id) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(clearCurrent());
    }
  }, [creating, id, dispatch]);

  // Cuando llega el producto actual en modo edición → rellenar form
  useEffect(() => {
    if (!creating && current) {
      setForm({
        name: current.name ?? "",
        description: current.description ?? "",
        price:
          typeof current.price === "number"
            ? String(current.price)
            : current.price ?? "",
        stock:
          typeof current.stock === "number"
            ? String(current.stock)
            : current.stock ?? "0",
        categoryId:
          current.categoryId != null ? String(current.categoryId) : "",
      });
    }
  }, [creating, current]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onImagesChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setImages(files);

    // Si estamos editando (producto ya existe) subimos directamente
    if (!creating && id) {
      await dispatch(uploadProductImages({ id, files }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const stock = Number.isNaN(Number(form.stock))
      ? 0
      : parseInt(form.stock, 10);
    const categoryId = form.categoryId ? Number(form.categoryId) : null;

    if (!name || !price || !categoryId) {
      console.error("Faltan campos obligatorios");
      return;
    }

    let result;

    if (creating) {
      // DTO que espera el backend ProductCreateDTO
      const payload = {
        name,
        description,
        price,
        stock,
        categoryId,
      };

      result = await dispatch(createProduct(payload));

      if (result.error) {
        console.error("Error al crear producto:", result.error);
        return;
      }

      const createdProduct = result.payload;

      // Si se adjuntaron imágenes al crear, las subimos ahora
      if (images.length && createdProduct?.id) {
        await dispatch(
          uploadProductImages({ id: createdProduct.id, files: images })
        );
      }
    } else {
      // Para update el backend espera ProductUpdateDTO (description, price, stock)
      const payload = {
        description,
        price,
        stock,
      };

      result = await dispatch(updateProduct({ id, data: payload }));

      if (result.error) {
        console.error("Error al actualizar producto:", result.error);
        return;
      }
    }

    dispatch(resetSaveStatus());
    nav("/admin/products");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-stone-100">
      <h1 className="mb-6 text-2xl font-semibold">
        {creating ? "Nuevo producto" : "Editar producto"}
      </h1>

      {/* Estado de carga del producto en edición */}
      {currentStatus === "loading" && !creating && (
        <p className="mb-4 text-stone-400">Cargando producto…</p>
      )}
      {currentStatus === "error" && (
        <p className="mb-4 text-red-400">
          Error al cargar el producto: {currentError}
        </p>
      )}

      {/* Estado de categorías */}
      {categoriesStatus === "loading" && (
        <p className="mb-4 text-stone-400">Cargando categorías…</p>
      )}
      {categoriesStatus === "error" && (
        <p className="mb-4 text-red-400">
          Error al cargar categorías: {categoriesError}
        </p>
      )}

      {/* Error al guardar */}
      {saveStatus === "failed" && (
        <p className="mb-4 text-red-400">Error al guardar: {saveError}</p>
      )}

      {/* Error al subir imágenes */}
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

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Stock</label>
            <input
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Categoría</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm outline-none"
            >
              <option value="">Seleccionar…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Carga de imágenes – disponible tanto en crear como en editar */}
        <div>
          <label className="mb-1 block text-sm">Imágenes</label>
          <input
            type="file"
            multiple
            onChange={onImagesChange}
            className="w-full text-sm"
          />
          {creating && images.length > 0 && (
            <p className="mt-1 text-xs text-stone-400">
              {images.length} archivo(s) listo(s) para subir al guardar.
            </p>
          )}
        </div>

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

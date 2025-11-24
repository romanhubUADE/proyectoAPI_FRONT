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
  <main className="mx-auto max-w-7xl px-6 py-10 text-stone-100">
    {/* MIGAS */}
    <div className="mb-6 text-sm text-stone-400">
      <button onClick={() => nav(-1)} className="hover:text-amber-500">
        Volver
      </button>
      <span className="mx-2">/</span>
      <span className="text-stone-200">
        {creating ? "Nuevo producto" : "Editar producto"}
      </span>
    </div>

    <div className="grid gap-8 lg:grid-cols-2">
      {/* ================================= */}
      {/* COLUMNA IZQUIERDA (IMÁGENES) */}
      {/* ================================= */}
      <section>
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-stone-800">
          {current?.images?.[0] || images[0] ? (
            <img
              src={
                images[0]
                  ? URL.createObjectURL(images[0])
                  : current.images[0].url || current.images[0]
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-500">
              Sin imagen
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => onImagesChange(e)}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {[1, 2].map((i) => {
            const im = images[i] || current?.images?.[i];
            return (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-800"
              >
                {im ? (
                  <img
                    src={
                      images[i]
                        ? URL.createObjectURL(images[i])
                        : im.url || im
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">
                    —
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <label className="mt-6 flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-amber-600/50 text-amber-400 hover:bg-amber-600/5">
          Agregar imágenes
          <input
            multiple
            accept="image/*"
            type="file"
            className="hidden"
            onChange={(e) => onImagesChange(e)}
          />
        </label>
      </section>

      {/* ================================= */}
      {/* COLUMNA DERECHA (FORMULARIO) */}
      {/* ================================= */}
      <section>
        {/* TÍTULO */}
        <label className="mb-1 block text-sm text-stone-300">
          Título del producto
        </label>
        <input
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-3xl font-bold text-stone-100 focus:border-amber-600 focus:outline-none"
          value={form.name}
          name="name"
          onChange={onChange}
        />

        {/* DESCRIPCIÓN CORTA */}
        <label className="mt-5 mb-1 block text-sm text-stone-300">
          Descripción corta
        </label>
        <textarea
          rows={3}
          name="description"
          value={form.description}
          onChange={onChange}
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
          placeholder="Breve descripción…"
        />

        {/* PRECIO Y STOCK */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          {/* PRECIO */}
          <div>
            <label className="mb-1 block text-sm text-stone-300">Precio</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-2xl font-bold text-amber-400 focus:border-amber-600 focus:outline-none"
              placeholder="$0.00"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="mb-1 block text-sm text-stone-300">Stock</label>
            <input
              type="number"
              min={0}
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-300 focus:border-amber-600 focus:outline-none"
              placeholder="Stock"
            />
          </div>
        </div>

        {/* CATEGORÍA */}
        <label className="mt-5 mb-1 block text-sm text-stone-300">
          Categoría
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-200 focus:border-amber-600 focus:outline-none"
        >
          <option value="">Seleccionar categoría…</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.description || c.name}
            </option>
          ))}
        </select>

        {/* BOTONES */}
        <div className="mt-5 flex gap-4">
          <button
            onClick={onSubmit}
            className="flex-1 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-60"
          >
            Guardar
          </button>

          {!creating && (
            <button
              type="button"
              onClick={() => {
                if (confirm("¿Eliminar producto?")) {
                  dispatch(updateProduct({ id, data: { activo: false } }));
                  nav("/admin/products");
                }
              }}
              className="flex-1 rounded-lg bg-red-700/25 px-6 py-3 text-sm font-semibold text-red-300 hover:bg-red-700/35"
            >
              Eliminar
            </button>
          )}
        </div>

      
      </section>
    </div>
  </main>
);


}

// src/pages/Catalog.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchProducts,
  fetchProductsAdmin,
} from "../redux/productsSlice.js";

const norm = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const CAT = {
  acoustic: "acústica",
  electric: "eléctrica",
  bass: "bajo",
  classical: "clásica",
};

export default function Catalog() {
  const { isAdmin } = useAuth();
  const { search } = useLocation();

  const dispatch = useDispatch();
  const { items: allProducts, status, error } = useSelector(
    (state) => state.products
  );

  // cargar productos según rol cuando el estado está idle
  useEffect(() => {
    if (status === "idle") {
      if (isAdmin) {
        dispatch(fetchProductsAdmin());
      } else {
        dispatch(fetchProducts());
      }
    }
  }, [status, isAdmin, dispatch]);

  // si cambia el rol (toggle admin/usuario), forzar recarga
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchProductsAdmin());
    } else {
      dispatch(fetchProducts());
    }
  }, [isAdmin, dispatch]);

  const sp = useMemo(() => new URLSearchParams(search), [search]);

  const catSlug = sp.get("cat") || "all";
  const wanted = catSlug !== "all" ? norm(CAT[catSlug] || catSlug) : "";

  const title =
    catSlug === "acoustic"
      ? "Guitarras Acústicas"
      : catSlug === "electric"
      ? "Guitarras Eléctricas"
      : catSlug === "bass"
      ? "Bajos"
      : catSlug === "classical"
      ? "Guitarras Clásicas"
      : "Catálogo";

  // estado de filtros
  const [catSet, setCatSet] = useState(new Set());
  const [price, setPrice] = useState({ min: null, max: null });

  const onFilters = useCallback((evt) => {
    if (evt.categories) setCatSet(new Set(evt.categories.map(norm)));

    if (evt.range) {
      if (evt.range === "low") setPrice({ min: 0, max: 100000 });
      if (evt.range === "mid") setPrice({ min: 100000, max: 150000 });
      if (evt.range === "high") setPrice({ min: 150000, max: Infinity });
    }

    if (evt.range === "" && (evt.min !== undefined || evt.max !== undefined)) {
      const min = evt.min === "" ? 0 : Number(evt.min);
      const max = evt.max === "" ? Infinity : Number(evt.max);
      setPrice({ min, max });
    }
  }, []);

  // base: filtro por categoría de la URL + visibilidad por rol (activo / inactivo)
  const base = useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts : [];

    const withCategory = !wanted
      ? list
      : list.filter((p) =>
          norm(p.categoryDescription || p.category || "").includes(wanted)
        );

    // solo el admin ve los inactivos (activo = 0 / false)
    if (isAdmin) return withCategory;

    return withCategory.filter(
      (p) =>
        p.activo === undefined ||
        p.activo === null ||
        p.activo === true ||
        p.activo === 1
    );
  }, [allProducts, wanted, isAdmin]);

  // aplicar filtros (categoría + precio)
  const products = useMemo(
    () =>
      base.filter((p) => {
        const catName = norm(p.categoryDescription || p.category || "");
        const byCat = catSet.size === 0 ? true : catSet.has(catName);

        const val = Number(p.price) || 0;
        const byPrice =
          (price.min == null ? true : val >= price.min) &&
          (price.max == null ? true : val <= price.max);

        return byCat && byPrice;
      }),
    [base, catSet, price]
  );

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
  <main className="mx-auto max-w-7xl px-6 py-10">
    {/* 2 columnas: filtros + productos */}
    <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
      {/* ACÁ ANTES TENÍAS EL <aside ...> */}
      <Filters onChange={onFilters} />

      <section>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-stone-100">{title}</h1>

          {isAdmin && (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
              Vista administrador
            </span>
          )}
        </div>

        {isLoading && (
          <p className="mb-4 text-sm text-stone-400">
            Cargando productos...
          </p>
        )}

        {isError && (
          <p className="mb-4 text-sm text-red-400">
            Error al cargar productos: {error || "Intentalo nuevamente."}
          </p>
        )}

        <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} isAdminView={isAdmin} />
          ))}

          {isAdmin && (
            <Link
              to="/admin/products/new"
              className="group relative block w-full aspect-[3/4] rounded-xl border border-dashed border-stone-700 bg-stone-900/10 transition-colors hover:border-amber-500 hover:bg-stone-900/30"
            >
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl leading-none text-amber-500 group-hover:text-amber-400">
                  +
                </span>
                <span className="mt-2 text-sm font-medium text-amber-400 group-hover:text-amber-300">
                  Añadir Guitarra
                </span>
              </div>
            </Link>
          )}
        </div>

        {products.length === 0 && !isLoading && !isError && (
          <div className="mt-6 text-stone-400">
            Sin productos disponibles.
          </div>
        )}
      </section>
    </div>
  </main>
);

}

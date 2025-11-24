// src/pages/Catalog.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchProducts } from "../redux/productsSlice.js";

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
  console.log("isAdmin?", isAdmin);
  const { search } = useLocation();

  const dispatch = useDispatch();
  const { items: allProducts, status, error } = useSelector(
    (state) => state.products
  );

  //Agregar dependencia de items para forzar recarga visual
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  //Forzar recarga al volver a la pa¡gina
  useEffect(() => {
    // Recargar productos cada vez que se monta el componente
    dispatch(fetchProducts());
  }, []); // Array vaci­o = solo al montar

  const sp = useMemo(() => new URLSearchParams(search), [search]);

  const catSlug = sp.get("cat") || "all";
  const wanted = catSlug !== "all" ? norm(CAT[catSlug] || catSlug) : "";

  const title =
    catSlug === "acoustic"
      ? "Guitarras Acsticas"
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

 // base por categori­a (de la URL)
const base = useMemo(() => {
  const list = Array.isArray(allProducts) ? allProducts : [];
  if (!wanted) return list;
  return list.filter((p) =>
    norm(p.categoryDescription || p.category || "").includes(wanted)
  );
}, [allProducts, wanted]);

// aplicar filtros (categoria + precio)
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
      <div className="grid grid-cols-[280px,1fr] gap-8">
        <Filters onChange={onFilters} />

        <section>
          <h1 className="mb-8 text-4xl font-bold text-stone-100">{title}</h1>

          {isLoading && (
            <p className="mb-4 text-sm text-stone-400">
              Cargando productos
            </p>
          )}

          {isError && (
            <p className="mb-4 text-sm text-red-400">
              Error al cargar productos: {error || "Intentalo nuevamente."}
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className="group relative block w-full rounded-xl border-2 border-dashed border-amber-500/70 bg-stone-900/10 hover:bg-stone-900/30 transition-colors aspect-[3/4]"
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
            <div className="mt-6 text-stone-400">Sin productos disponibles.</div>
          )}
        </section>
      </div>
    </main>
  );
}
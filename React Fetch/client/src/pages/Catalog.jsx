import { useMemo, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const CAT = { acoustic: "acústica", electric: "eléctrica", bass: "bajo", classical: "clásica" };

export default function Catalog() {
  const { isAdmin } = useAuth();
  const { state } = useShop();
  const { search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);

  const catSlug = sp.get("cat") || "all";
  const wanted = catSlug !== "all" ? norm(CAT[catSlug] || catSlug) : "";

  const title =
    catSlug === "acoustic" ? "Guitarras Acústicas" :
    catSlug === "electric" ? "Guitarras Eléctricas" :
    catSlug === "bass" ? "Bajos" :
    catSlug === "classical" ? "Guitarras Clásicas" : "Catálogo";

  // --- estado de filtros (igual que Search) ---
  const [catSet, setCatSet] = useState(new Set());
  const [price, setPrice] = useState({ min: null, max: null });

  const onFilters = useCallback((evt) => {
    if (evt.categories) setCatSet(new Set(evt.categories.map(norm)));
    if (evt.range) {
      if (evt.range === "low")  setPrice({ min: 0,      max: 100000 });
      if (evt.range === "mid")  setPrice({ min: 100000, max: 150000 });
      if (evt.range === "high") setPrice({ min: 150000, max: Infinity });
    }
    if (evt.range === "" && (evt.min !== undefined || evt.max !== undefined)) {
      const min = evt.min === "" ? 0 : Number(evt.min);
      const max = evt.max === "" ? Infinity : Number(evt.max);
      setPrice({ min, max });
    }
  }, []);

  // base por categoría de la URL
  const base = useMemo(() => {
    const list = Array.isArray(state?.products) ? state.products : [];
    if (!wanted) return list;
    return list.filter((p) => norm(p.category || "").includes(wanted));
  }, [state?.products, wanted]);

  // aplicar filtros (categorías seleccionadas + precio)
  const products = useMemo(() => {
    return base.filter((p) => {
      const byCat = catSet.size === 0 ? true : catSet.has(norm(p.category || ""));
      const val = Number(p.price) || 0;
      const byPrice =
        (price.min == null ? true : val >= price.min) &&
        (price.max == null ? true : val <= price.max);
      return byCat && byPrice;
    });
  }, [base, catSet, price]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-[280px,1fr] gap-8">
        <Filters onChange={onFilters} />

        <section>
          <h1 className="mb-8 text-4xl font-bold text-stone-100">{title}</h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className="group relative block w-full rounded-xl border-2 border-dashed border-amber-600/40 bg-stone-900/20 hover:border-amber-500/70 hover:bg-stone-900/30 transition-colors aspect-[3/4]"
              >
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl leading-none text-amber-500 group-hover:text-amber-400">＋</span>
                  <span className="mt-2 text-sm font-medium text-amber-400 group-hover:text-amber-300">Añadir Guitarra</span>
                </div>
              </Link>
            )}
          </div>

          {products.length === 0 && (
            <div className="mt-6 text-stone-400">Sin productos disponibles.</div>
          )}
        </section>
      </div>
    </main>
  );
}
import { useMemo } from "react";
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

  const products = useMemo(() => {
    const list = Array.isArray(state?.products) ? state.products : [];
    if (!wanted) return list;
    return list.filter((p) => norm(p.category || "").includes(wanted));
  }, [state?.products, wanted]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-[280px,1fr] gap-8">
        <Filters />

        <section>
          <h1 className="mb-8 text-4xl font-bold text-stone-100">{title}</h1>

          {/* grilla igual que el mock: 3 por fila en desktop */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}

            {isAdmin && (
              <Link
                to="/admin/products/new"
                className="
                  group relative block w-full
                  rounded-xl border-2 border-dashed border-amber-600/40
                  bg-stone-900/20 hover:border-amber-500/70 hover:bg-stone-900/30
                  transition-colors
                  aspect-[3/4]                        /* igual proporción a la tarjeta de producto */
                "
              >
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl leading-none text-amber-500 group-hover:text-amber-400">＋</span>
                  <span className="mt-2 text-sm font-medium text-amber-400 group-hover:text-amber-300">
                    Añadir Guitarra
                  </span>
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
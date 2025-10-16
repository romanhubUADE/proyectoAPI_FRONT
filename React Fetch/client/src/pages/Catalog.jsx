import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";

const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const CAT = { acoustic: "acústica", electric: "eléctrica", bass: "bajo", classical: "clásica" };

export default function Catalog() {
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
    const list = state?.products ?? [];
    if (!wanted) return list;
    return list.filter((p) => norm(p.category || "").includes(wanted));
  }, [state?.products, wanted]);

  return (
    <main className="mx-auto max-w-8x1 px-6 py-10">
      <div className="grid gap-8 grid-cols-[280px,1fr]">
        <Filters />
        <section>
          <h1 className="text-4xl font-bold text-stone-100 mb-8">{title}</h1>

          {/* Ajuste de la grilla */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
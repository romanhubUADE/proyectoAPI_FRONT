import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Filters from "../components/Filters.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useShop } from "../context/ShopContext.jsx";

export default function Catalog() {
  const { state, priceWithDiscount } = useShop();
  const { search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);

  const cat = sp.get("cat") || "all";
  const q = (sp.get("q") || "").toLowerCase();
  const min = Number(sp.get("min") || 0);
  const max = Number(sp.get("max") || Infinity);

  const title = useMemo(() => {
    if (cat === "acoustic") return "Guitarras Acústicas";
    if (cat === "electric") return "Guitarras Eléctricas";
    if (cat === "bass") return "Bajos";
    if (cat === "classical") return "Guitarras Clásicas";
    return "Catálogo";
  }, [cat]);

  const products = useMemo(() => {
    return state.products.filter(p => {
      const inCat = cat === "all" ? true : p.category?.toLowerCase().includes(cat);
      const text = `${p.name} ${p.brand || ""} ${p.category || ""}`.toLowerCase();
      const inSearch = q ? text.includes(q) : true;
      const price = priceWithDiscount ? priceWithDiscount(p) : p.price;
      const inRange = price >= min && price <= max;
      return inCat && inSearch && inRange;
    });
  }, [state.products, cat, q, min, max, priceWithDiscount]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
        <Filters />

        <section>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
            {title}
          </h1>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

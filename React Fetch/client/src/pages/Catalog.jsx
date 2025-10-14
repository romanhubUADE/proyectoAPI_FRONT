import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const { state, priceWithDiscount } = useShop();
  const [sp] = useSearchParams();
  const catParam = (sp.get("cat") || "all").toLowerCase();

  // Datos seguros aunque no haya productos
  const products = state?.products ?? [];

  const [sel, setSel] = useState({
    brand: new Set(),
    wood: new Set(),
    color: new Set(),
    min: 0,
    max: 3000,
  });

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products]
  );
  const woods = useMemo(
    () => [...new Set(products.map((p) => p.wood).filter(Boolean))],
    [products]
  );
  const colors = useMemo(
    () => [...new Set(products.map((p) => p.color).filter(Boolean))],
    [products]
  );

  const toggle = (group, value) =>
    setSel((s) => {
      const next = new Set(s[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...s, [group]: next };
    });

  const list = useMemo(() => {
    let items = [...products];

    // filtrar por categoría
    if (catParam !== "all") {
      items = items.filter(
        (p) => (p.category || "").toLowerCase() === catParam
      );
    }

    // eliminar sin stock
    items = items.filter((p) => (p.stock ?? 0) > 0);

    // aplicar filtros
    if (sel.brand.size) items = items.filter((p) => sel.brand.has(p.brand));
    if (sel.wood.size) items = items.filter((p) => sel.wood.has(p.wood));
    if (sel.color.size) items = items.filter((p) => sel.color.has(p.color));

    // rango de precio
    items = items.filter((p) => {
      const pr = priceWithDiscount?.(p) ?? p.price ?? 0;
      return pr >= sel.min && pr <= sel.max;
    });

    return items;
  }, [products, sel, catParam, priceWithDiscount]);

  // ajustar máximo dinámico
  useEffect(() => {
    if (!products.length) return;
    const prices = products.map((p) => priceWithDiscount?.(p) ?? p.price ?? 0);
    const maxSeen = Math.max(3000, ...prices);
    setSel((s) => ({ ...s, max: Math.min(s.max, maxSeen) }));
  }, [products, priceWithDiscount]);

  const title = {
    all: "Guitarras",
    acoustic: "Guitarras Acústicas",
    electric: "Guitarras Eléctricas",
    bass: "Bajos",
    classical: "Guitarras Clásicas",
  }[catParam] || "Guitarras";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        {/* Filtros */}
        <aside className="w-full lg:w-72 xl:w-80">
          <div className="sticky top-28 rounded-xl border border-primary/20 bg-background-light p-6 dark:border-primary/20 dark:bg-background-dark">
            <h2 className="text-2xl font-bold">Filtros</h2>

            <div className="mt-6 space-y-6">
              {/* Marca */}
              <div>
                <h3 className="font-bold">Marca</h3>
                <div className="mt-3 space-y-3">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary"
                        checked={sel.brand.has(b)}
                        onChange={() => toggle("brand", b)}
                      />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de madera */}
              <div>
                <h3 className="font-bold">Tipo de Madera</h3>
                <div className="mt-3 space-y-3">
                  {woods.map((w) => (
                    <label key={w} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary"
                        checked={sel.wood.has(w)}
                        onChange={() => toggle("wood", w)}
                      />
                      <span className="text-sm">{w}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="font-bold">Color</h3>
                <div className="mt-3 space-y-3">
                  {colors.map((c) => (
                    <label key={c} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary"
                        checked={sel.color.has(c)}
                        onChange={() => toggle("color", c)}
                      />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="font-bold">Rango de Precios</h3>
                <div className="mt-4">
                  <input
                    type="range"
                    min={0}
                    max={sel.max}
                    value={sel.min}
                    onChange={(e) =>
                      setSel((s) => ({ ...s, min: Number(e.target.value) }))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/30"
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span>${sel.min}</span>
                    <span>${sel.max}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Lista de productos */}
        <section className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {list.length > 0 ? (
              list.map((p) => <ProductCard key={p.id} p={p} />)
            ) : (
              <p className="opacity-70 mt-10">No hay productos en esta categoría.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

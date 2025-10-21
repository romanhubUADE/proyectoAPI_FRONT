import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Filters from "../components/Filters.jsx";

const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export default function Search() {
  const { state } = useShop();
  const nav = useNavigate();
  const { search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);

  const qParam = sp.get("q") || "";
  const pageParam = Number(sp.get("page") || 1);

  const [q, setQ] = useState(qParam);
  useEffect(() => setQ(qParam), [qParam]);

  // filtros
  const [catSet, setCatSet] = useState(new Set());
  const [price, setPrice] = useState({ min: null, max: null });

  // MEMOIZED: evita bucle con Filters
  const onFilters = useCallback((evt) => {
    if (evt.categories) setCatSet(new Set(evt.categories));
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

  // búsqueda
  const base = useMemo(() => {
    const qn = norm(qParam);
    if (!qn) return [];
    return (state?.products ?? []).filter((p) => {
      const text = `${p.name} ${p.brand ?? ""} ${p.category ?? ""}`;
      return norm(text).includes(qn);
    });
  }, [state?.products, qParam]);

  // aplicar filtros
  const filtered = useMemo(() => {
    return base.filter((p) => {
      const byCat = catSet.size === 0 ? true : catSet.has(norm(p.category || ""));
      const val = Number(p.price) || 0;
      const byPrice =
        (price.min == null ? true : val >= price.min) &&
        (price.max == null ? true : val <= price.max);
      return byCat && byPrice;
    });
  }, [base, catSet, price]);

  // paginación
  const pageSize = 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, pageParam), totalPages);
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="grid gap-8 grid-cols-[280px,1fr] items-start">
        <aside className="self-start">
          <Filters onChange={onFilters} />
        </aside>

        <section className="self-start">
          <h1 className="text-4xl font-bold text-stone-100">Resultados de Búsqueda</h1>
          <p className="mt-2 text-sm text-stone-400">
            {qParam ? <>Mostrando resultados para <span className="italic">“{qParam}”</span></> : "Escribe un término para buscar."}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slice.map((p) => <ProductCard key={p.id} p={p} />)}
            {slice.length === 0 && <div className="text-stone-400">Sin resultados.</div>}
          </div>

          {total > pageSize && (
            <div className="mt-8 flex items-center justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                makeHref={(n) => `/search?q=${encodeURIComponent(qParam)}&page=${n}`}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

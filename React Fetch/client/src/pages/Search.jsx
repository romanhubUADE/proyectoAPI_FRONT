import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Filters from "../components/Filters.jsx";

import { fetchProducts } from "../redux/productsSlice.js";

const norm = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

// cuántos productos por página
const PAGE_SIZE = 9;

export default function Search() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { search } = useLocation();

  const { items: allProducts, status, error } = useSelector(
    (state) => state.products
  );

  // query y página desde la URL
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const qParam = sp.get("q") || "";
  const pageParam = Number(sp.get("page") || 1);

  // estado local del input de búsqueda
  const [q, setQ] = useState(qParam);
  useEffect(() => setQ(qParam), [qParam]);

  // cargar productos si todavía no se cargaron
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // filtros laterales
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

  // handler del submit del buscador → actualiza la URL
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      nav("/search");
      return;
    }
    nav(`/search?q=${encodeURIComponent(trimmed)}&page=1`);
  };

  // productos base: a partir de Redux + texto buscado (qParam)
  const base = useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts : [];
    if (!qParam.trim()) return list;

    const nq = norm(qParam);
    return list.filter((p) => {
      const name = norm(p.name || "");
      const desc = norm(p.description || "");
      const brand = norm(p.brand || p.marca || "");
      const cat = norm(p.category || "");
      return (
        name.includes(nq) ||
        desc.includes(nq) ||
        brand.includes(nq) ||
        cat.includes(nq)
      );
    });
  }, [allProducts, qParam]);

  // aplicar filtros de categorías y precio
  const filtered = useMemo(() => {
    return base.filter((p) => {
      const byCat =
        catSet.size === 0 ? true : catSet.has(norm(p.category || ""));
      const val = Number(p.price) || 0;
      const byPrice =
        (price.min == null ? true : val >= price.min) &&
        (price.max == null ? true : val <= price.max);
      return byCat && byPrice;
    });
  }, [base, catSet, price]);

  // paginación
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );
  const page =
    Number.isFinite(pageParam) && pageParam > 0
      ? Math.min(pageParam, totalPages)
      : 1;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <form
          onSubmit={handleSubmit}
          className="flex max-w-xl gap-3 rounded-xl border border-stone-700 bg-stone-900/60 px-4 py-3 text-sm"
        >
          <input
            type="text"
            className="flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-500"
            placeholder="Buscar guitarras por nombre, marca o categoría…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-4 py-1.5 font-semibold text-stone-900 hover:bg-amber-400"
          >
            Buscar
          </button>
        </form>
        {qParam && (
          <p className="mt-2 text-xs text-stone-400">
            Resultados para:{" "}
            <span className="font-semibold text-stone-200">
              “{qParam}”
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-[280px,1fr] gap-8">
        <Filters onChange={onFilters} />

        <section>
          {isLoading && (
            <p className="mb-4 text-sm text-stone-400">
              Cargando productos…
            </p>
          )}

          {isError && (
            <p className="mb-4 text-sm text-red-400">
              Error al cargar productos:{" "}
              {error || "Intentalo nuevamente."}
            </p>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <p className="mb-4 text-sm text-stone-400">
              No se encontraron productos para esta búsqueda.
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {filtered.length > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                makeHref={(n) =>
                  `/search?q=${encodeURIComponent(
                    qParam
                  )}&page=${n}`
                }
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
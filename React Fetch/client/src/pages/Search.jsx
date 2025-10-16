import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";

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

  const results = useMemo(() => {
    const qn = norm(qParam);
    if (!qn) return [];
    return (state?.products ?? []).filter((p) => {
      const text = `${p.name} ${p.brand ?? ""} ${p.category ?? ""}`;
      return norm(text).includes(qn);
    });
  }, [state?.products, qParam]);

  // paginación
  const pageSize = 12;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, pageParam), totalPages);
  const slice = results.slice((page - 1) * pageSize, page * pageSize);

  const onSubmit = (e) => {
    e.preventDefault();
    nav(`/search?q=${encodeURIComponent(q)}&page=1`);
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="grid gap-8 grid-cols-[280px,1fr]">
        {/* Sidebar visual para mantener la composición de la plantilla */}
        <aside className="rounded-xl border border-stone-800 bg-[#20160F] p-6 h-fit">
          <h2 className="text-xl font-bold text-stone-100">Filtrar por</h2>
          <div className="mt-6 text-stone-400 text-sm space-y-4">
            <section>
              <div className="font-semibold text-stone-300 mb-2">Marca</div>
              <ul className="space-y-2">
                {["Stringer", "Harmony", "Blue Ridge"].map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-stone-600 bg-transparent text-amber-500" disabled />
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="font-semibold text-stone-300 mb-2">Tipo de Madera</div>
              <ul className="space-y-2 opacity-60">
                {["Caoba", "Arce", "Abeto"].map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-stone-600" disabled />
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="font-semibold text-stone-300 mb-2">Color</div>
              <ul className="space-y-2 opacity-60">
                {["Natural", "Sunburst", "Negro"].map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-stone-600" disabled />
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="font-semibold text-stone-300 mb-2">Rango de Precios</div>
              <input type="range" min="50" max="3000" defaultValue="800" className="h-1.5 w-full rounded-full bg-stone-700" disabled />
              <div className="mt-2 flex justify-between text-xs text-stone-500">
                <span>$50</span><span>$3000</span>
              </div>
            </section>
          </div>
        </aside>

        <section>
          <h1 className="text-4xl font-bold text-stone-100">Resultados de Búsqueda</h1>
          <p className="mt-2 text-sm text-stone-400">
            {qParam ? <>Mostrando resultados para <span className="italic">“{qParam}”</span></> : "Escribe un término para buscar."}
          </p>


          {/* Grilla de resultados */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slice.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
            {slice.length === 0 && <div className="text-stone-400">Sin resultados.</div>}
          </div>

          {/* Paginación */}
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
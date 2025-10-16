import { Link } from "react-router-dom";

export default function Pagination({ page, totalPages, makeHref }) {
  const windowSize = 1; // muestra página actual +-1 como en la ref
  const pages = [];
  for (let i = Math.max(1, page - windowSize); i <= Math.min(totalPages, page + windowSize); i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link
        to={makeHref(Math.max(1, page - 1))}
        className="px-3 py-1 rounded-md border border-stone-700 text-stone-300 hover:bg-stone-800"
      >
        &lt;
      </Link>

      {page - windowSize > 1 && <span className="text-stone-500">…</span>}

      {pages.map((n) =>
        n === page ? (
          <span key={n} className="px-3 py-1 rounded-md bg-amber-600 text-white font-semibold">{n}</span>
        ) : (
          <Link
            key={n}
            to={makeHref(n)}
            className="px-3 py-1 rounded-md border border-stone-700 text-stone-300 hover:bg-stone-800"
          >
            {n}
          </Link>
        )
      )}

      {page + windowSize < totalPages && <span className="text-stone-500">…</span>}

      <Link
        to={makeHref(Math.min(totalPages, page + 1))}
        className="px-3 py-1 rounded-md border border-stone-700 text-stone-300 hover:bg-stone-800"
      >
        &gt;
      </Link>
    </nav>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useShop } from "../context/ShopContext.jsx";

export default function NavBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { state } = useShop();

  const count = (state?.cart ?? []).reduce((n, it) => n + (it.qty ?? it.quantity ?? 1), 0);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`); // <— antes iba a /catalog
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200 bg-background-light/80 backdrop-blur-sm dark:border-stone-800 dark:bg-background-dark/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.25 2.25a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75h-4.5ZM15 3.75h3v16.5h-3V3.75Z" />
            <path d="M4.5 3.75a.75.75 0 0 0-.75.75v15a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75h-4.5ZM5.25 5.25h3v13.5h-3V5.25Z" />
          </svg>
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">String &amp; Soul</h1>
        </Link>

        <nav className="flex gap-6">
          <Link to="/catalog" className="text-sm font-medium text-white hover:text-primary">Catálogo</Link>
          <Link to="/catalog?cat=electric" className="text-sm font-medium text-white hover:text-primary">Electric</Link>
          <Link to="/catalog?cat=acoustic" className="text-sm font-medium text-white hover:text-primary">Acoustic</Link>
          <Link to="/catalog?cat=bass" className="text-sm font-medium text-white hover:text-primary">Bass</Link>
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-44 sm:w-52 lg:w-64">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar guitarras..."
              className="w-full rounded-md border border-stone-300 bg-transparent py-1.5 pl-9 pr-3 text-sm text-stone-800 placeholder-stone-500 focus:border-primary focus:ring-1 focus:ring-primary dark:border-stone-700 dark:text-white dark:placeholder-stone-400"
            />
            <svg className="absolute left-2 top-1.5 h-5 w-5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 3a7.5 7.5 0 016 13.65z" />
            </svg>
          </form>

          <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-primary/10 dark:text-stone-200">Iniciar sesión</Link>
          <Link to="/register" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Registrarse</Link>

          <Link to="/cart" className="relative rounded p-2 text-stone-600 hover:bg-primary/10 dark:text-stone-300" aria-label="Carrito">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.7,27.44A8,8,0,0,0,42,24H16a8,8,0,0,0,0,16H34.29l30.36,139.86A28,28,0,1,0,116,204h76a28,28,0,1,0,27.14-39.13L199.09,88h11.78A8,8,0,0,0,222.14,58.87Z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-primary px-1.5 text-center text-[10px] font-bold leading-4 text-white animate-bounce">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className="relative rounded-full p-2 text-stone-600 hover:bg-primary/10 dark:text-stone-300"
            aria-label="Perfil de usuario"
          >
            <svg
              fill="currentColor"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 1 1-10 0V7a5 5 0 0 1 5-5zm0 10a4 4 0 0 0-4 4v3h8v-3a4 4 0 0 0-4-4z" />
            </svg>
          </Link>
          
        </div>
      </div>
    </header>
  );
}

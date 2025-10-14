// src/components/NavBar.jsx
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-background-light/80 dark:border-stone-800 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + navegación */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.25 2.25a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75h-4.5ZM15 3.75h3v16.5h-3V3.75Z" />
              <path d="M4.5 3.75a.75.75 0 0 0-.75.75v15a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75h-4.5ZM5.25 5.25h3v13.5h-3V5.25Z" />
            </svg>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">String &amp; Soul</h1>
          </Link>

          <nav className="gap-6 md:flex">
            <Link to="/catalog" className="text-sm font-medium text-stone-700 hover:text-primary dark:text-stone-300">
              Catálogo
            </Link>
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog"> New Arrivals </Link> 
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=electric"> Electric </Link> 
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=acoustic"> Acoustic </Link> 
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=bass"> Bass </Link> 
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=classical"> Classical </Link>
          </nav>
        </div>

        

        {/* Acciones: login/register/cart */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-primary/10 dark:text-stone-200">
            Iniciar sesión
          </Link>

          <Link to="/register" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-95 md:inline-block">
            Registrarse
          </Link>

          <Link
            className="rounded p-2 text-stone-600 hover:bg-primary/10 dark:text-stone-300 dark:hover:bg-primary/20"
            to="/cart"
            aria-label="Carrito"
          >
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256" className="inline-block">
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.7,27.44A8,8,0,0,0,42,24H16a8,8,0,0,0,0,16H34.29l30.36,139.86A28,28,0,1,0,116,204h76a28,28,0,1,0,27.14-39.13L199.09,88h11.78A8,8,0,0,0,222.14,58.87Z" />
            </svg>
          </Link>

          {/* Enlace a mi cuenta */}
          <Link to="/account" className="ml-2 rounded-full p-2 text-stone-600 hover:bg-primary/10 dark:text-stone-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
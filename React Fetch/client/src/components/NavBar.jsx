import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-primary/20 dark:border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + navegación */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 py-4">
            <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.25 2.25a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75h-4.5ZM15 3.75h3v16.5h-3V3.75Z" />
              <path d="M4.5 3.75a.75.75 0 0 0-.75.75v15a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75h-4.5ZM5.25 5.25h3v13.5h-3V5.25Z" />
            </svg>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">String &amp; Soul</h1>
          </Link>

          {/* Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog">
              New Arrivals
            </Link>
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=electric">
              Electric
            </Link>
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=acoustic">
              Acoustic
            </Link>
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=bass">
              Bass
            </Link>
            <Link className="text-sm font-medium hover:text-primary dark:hover:text-primary" to="/catalog?cat=classical">
              Classical
            </Link>
          </nav>
        </div>

        {/* Iconos de búsqueda, usuario, carrito */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden items-center rounded bg-stone-100 dark:bg-stone-800 md:flex">
            <span className="pl-3">
              <svg className="text-stone-500 dark:text-stone-400" fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </span>
            <input
              className="flex-1 border-none bg-transparent py-2 pl-2 pr-3 text-sm focus:outline-none focus:ring-0 text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-stone-400"
              placeholder="Search"
            />
          </div>

          {/* User */}
          <Link
            className="rounded p-2 text-stone-600 hover:bg-primary/20 hover:text-primary dark:text-stone-300 dark:hover:bg-primary/20 dark:hover:text-primary"
            to="/account"
          >
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            className="rounded p-2 text-stone-600 hover:bg-primary/20 hover:text-primary dark:text-stone-300 dark:hover:bg-primary/20 dark:hover:text-primary"
            to="/cart"
          >
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

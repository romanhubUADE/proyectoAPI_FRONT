import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-primary/20 bg-background-light dark:border-primary/30 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
          <Link
            className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
            to="/catalog"
          >
            Tienda
          </Link>
          <Link
             className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
             to="/faq"
>
  Preguntas Frecuentes
</Link>


          <Link
            className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
            to="/about"
          >
            Sobre Nosotros
          </Link>

          <Link
            className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
            to="/contact"
          >
            Contacto
          </Link>
        </nav>

        <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-500">
          © {new Date().getFullYear()} String &amp; Soul. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

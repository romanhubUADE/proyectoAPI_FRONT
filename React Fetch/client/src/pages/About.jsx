export default function About() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-stone-800 dark:text-stone-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Sobre Nosotros
          </h1>
          <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
            La historia detrás de cada acorde.
          </p>
        </header>

        <section className="mt-16 space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-primary text-center">Nuestra Historia</h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-600 dark:text-stone-400 text-center">
              String & Soul nació de una pasión compartida por la música y la artesanía de las guitarras.
              Lo que comenzó como un pequeño taller se convirtió en un punto de encuentro para la comunidad,
              con instrumentos de calidad y un trato cercano.
            </p>
          </div>

          <div className="grid gap-12 border-t border-primary/20 dark:border-primary/30 pt-12 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-primary">Misión y Visión</h3>
              <p className="mt-4 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
                <strong>Misión:</strong> Inspirar y equipar a músicos de todos los niveles con
                instrumentos y servicio excepcionales.
              </p>
              <p className="mt-2 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
                <strong>Visión:</strong> Ser el destino de referencia para los amantes de la guitarra,
                preservando el legado y fomentando nuevas generaciones.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary">Nuestros Valores</h3>
              <ul className="mt-4 list-disc list-inside space-y-2 text-lg text-stone-600 dark:text-stone-400">
                <li><strong>Autenticidad:</strong> Cada guitarra tiene una historia.</li>
                <li><strong>Comunidad:</strong> Un lugar para conectar mediante la música.</li>
                <li><strong>Calidad:</strong> Estándares altos de sonido y artesanía.</li>
                <li><strong>Pasión:</strong> Vivimos la música en todo lo que hacemos.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

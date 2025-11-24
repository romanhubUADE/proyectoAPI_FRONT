export default function Contact() {
  return (
    <main className="bg-background-light dark:bg-background-dark text-stone-800 dark:text-stone-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center">Contactanos</h1>
        <p className="mt-4 text-center text-stone-500 dark:text-stone-400">
          Estamos para ayudarte. Escribinos para cualquier pregunta u opinion.
        </p>

        {/* 2 columnas lado a lado a partir de md */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Formulario (izquierda) */}
          <form className="rounded-xl bg-primary/10 p-8 dark:bg-primary/20 space-y-4">
            <h2 className="text-2xl font-bold">Envianos un mensaje</h2>
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input className="w-full rounded-md border border-primary/30 bg-background-light dark:bg-background-dark p-3" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" className="w-full rounded-md border border-primary/30 bg-background-light dark:bg-background-dark p-3" />
            </div>
            <div>
              <label className="block text-sm mb-1">Tema</label>
              <input className="w-full rounded-md border border-primary/30 bg-background-light dark:bg-background-dark p-3" />
            </div>
            <div>
              <label className="block text-sm mb-1">Mensaje</label>
              <textarea rows="5" className="w-full rounded-md border border-primary/30 bg-background-light dark:bg-background-dark p-3" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-primary/90">
              Send Message
            </button>
          </form>

          {/* Info + mapa (derecha) */}
          <div className="space-y-10">
            <section>
              <h3 className="text-xl font-bold">Informacion de Contacto</h3>
              <div className="mt-3 space-y-1 text-stone-600 dark:text-stone-400">
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Email:</strong> contacto@stringandsoul.com</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold">Donde estamos:</h3>
              <div className="mt-4 h-[360px] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.45340254843!2d-58.51569879470437!3d-34.61565476986264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e88e88e87!2sBuenos%20Aires%2C%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1760569650881!5m2!1ses-419!2sar"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-3 text-stone-500 dark:text-stone-400">
                Visitanos en el corazon de Buenos Aires.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

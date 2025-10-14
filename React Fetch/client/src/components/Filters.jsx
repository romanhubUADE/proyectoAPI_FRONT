export default function Filters() {
  return (
    <div className="sticky top-28 rounded-xl border border-primary/20 bg-background-light p-6 dark:border-primary/20 dark:bg-background-dark">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Filtros</h2>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Marca</h3>
          <div className="mt-3 space-y-3">
            {["Harmony", "Silver Creek", "Blue Ridge", "Recording King"].map((m) => (
              <label key={m} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Tipo de Madera</h3>
          <div className="mt-3 space-y-3">
            {["Caoba", "Abeto", "Palisandro"].map((m) => (
              <label key={m} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Color</h3>
          <div className="mt-3 space-y-3">
            {["Natural", "Sunburst", "Negro"].map((m) => (
              <label key={m} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-primary/40 bg-transparent text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Rango de Precios</h3>
          <div className="mt-4">
            <input
              type="range"
              min="100"
              max="3000"
              defaultValue="500"
              className="range-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/30"
            />
            <div className="mt-2 flex justify-between text-sm text-stone-600 dark:text-stone-400">
              <span>$100</span>
              <span>$3000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

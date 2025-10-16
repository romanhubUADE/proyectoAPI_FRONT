export default function Filters() {
  return (
    <aside className="sticky top-24 rounded-xl border border-stone-800 bg-[#20160F] p-6 h-fit">
      <h2 className="text-2xl font-bold text-stone-100">Filtros</h2>

      <div className="mt-4 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Marca</h3>
          <div className="space-y-2">
            {["Harmony", "Silver Creek", "Blue Ridge", "Recording King"].map((m) => (
              <label key={m} className="flex items-center gap-2 text-stone-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-600 bg-transparent text-amber-500 focus:ring-amber-500"
                  defaultChecked={m === "Blue Ridge"}
                />
                <span className="text-sm">{m}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Tipo de Madera</h3>
          <div className="space-y-2 text-stone-300 text-sm">
            {["Caoba", "Abeto", "Palosanto"].map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-stone-600 bg-transparent text-amber-500 focus:ring-amber-500" />
                {m}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Color</h3>
          <div className="space-y-2 text-stone-300 text-sm">
            {["Natural", "Sunburst", "Negro"].map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-stone-600 bg-transparent text-amber-500 focus:ring-amber-500" />
                {c}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-stone-300 mb-2">Rango de Precios</h3>
          <input
            type="range"
            min="100"
            max="3000"
            defaultValue="800"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-stone-700"
          />
          <div className="mt-2 flex justify-between text-xs text-stone-500">
            <span>$100</span>
            <span>$3000</span>
          </div>
        </section>
      </div>
    </aside>
  );
}
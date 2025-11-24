// src/pages/FAQ.jsx
import { useRef, useState, useEffect } from "react";

function Item({ i, q, a, active, onToggle }) {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => { if (ref.current) setH(active ? ref.current.scrollHeight : 0); }, [active]);

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-primary/20 bg-transparent">
      {/* header sin blanco */}
      <button
        onClick={() => onToggle(i)}
        aria-expanded={active}
        aria-controls={`faq-${i}`}
        className="flex w-full items-center justify-between px-5 py-4 bg-transparent hover:bg-primary/10 text-left"
      >
        <span className="font-semibold text-primary">{q}</span>
        <svg
          className={`h-5 w-5 text-primary transition-transform ${active ? "rotate-180" : ""}`}
          viewBox="0 0 256 256" fill="currentColor"
        >
          <path d="M213.7 101.7l-80 80a8 8 0 01-11.4 0l-80-80A8 8 0 0153.7 90.3L128 164.7l74.3-74.4a8 8 0 0111.4 11.4z"/>
        </svg>
      </button>

      {/* panel con mismo tono, no blanco */}
      <div
        id={`faq-${i}`}
        style={{ height: h }}
        className="overflow-hidden transition-[height] duration-300 ease-out bg-primary/10"
      >
        <div ref={ref} className="px-7 pt-7 pb-7 text-stone-300">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    { q: "¿Cómo hago un pedido?", a: "Agregá productos al carrito y continuá al checkout." },
    { q: "¿Qué métodos de pago aceptan?", a: "Tarjetas de crédito, débito y Efectivo en el momento de la entrega!." },
    { q: "¿Puedo cancelar mi pedido?", a: "Sí, dentro de las 24 h si aún no fue enviado." },
    { q: "¿Cuánto tarda el envío?", a: "Envío estándar 3–7 días hábiles según tu zona." },
    { q: "¿Tienen garantía?", a: "Garantía limitada por defectos de fábrica." },
  ];
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen((v) => (v === i ? null : i));

  return (
    <main className="bg-background-light dark:bg-background-dark text-stone-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-4xl font-extrabold text-center">Preguntas Frecuentes</h1>
        <p className="mt-3 text-center text-stone-400">
          ¿No encontrás tu respuesta? Escribinos a <a className="text-primary" href="mailto:soporte@stringandsoul.com">soporte@stringandsoul.com</a>.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((f, i) => (
            <Item key={i} i={i} q={f.q} a={f.a} active={open === i} onToggle={toggle} />
          ))}
        </div>
      </div>
    </main>
  );
}

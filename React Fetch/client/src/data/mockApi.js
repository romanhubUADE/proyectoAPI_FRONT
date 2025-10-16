const LS = {
  get: (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

const seed = [
  // Eléctricas
  {
    id: "1",
    name: "Stratocaster SSS",
    price: 800,
    stock: 5,
    category: "eléctrica",
    image:
      "https://images.unsplash.com/photo-1461783436728-0a9217714692?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1461783436728-0a9217714692?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
      "https://images.unsplash.com/photo-1513863322410-6c21196f14a9?q=80&w=800",
    ],
    description: "Cuerpo aliso",
    short:
      "Sonido clásico y versátil. Ideal para rock, blues y pop.",
    topWood: "Alder",
    backSides: "Alder",
    neck: "Maple",
    fretboard: "Rosewood",
    scale: "25.5\"",
    nutWidth: "1.65\"",
    finish: "Gloss",
    discount: 0,
  },
  {
    id: "2",
    name: "Les Paul Standard",
    price: 1200,
    stock: 3,
    category: "eléctrica",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=800",
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=800",
    ],
    description: "Tapa arce",
    short:
      "Sustain potente y tono grueso. Perfecta para rock clásico.",
    topWood: "Maple",
    backSides: "Mahogany",
    neck: "Mahogany",
    fretboard: "Rosewood",
    scale: "24.75\"",
    nutWidth: "1.695\"",
    finish: "Gloss",
    discount: 10,
  },

  // Acústica (una con stock 0 para ejemplo)
  {
    id: "3",
    name: "Acústica Cort",
    price: 450,
    stock: 0,
    category: "acústica",
    image:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1520975682031-46bcafeb5d67?q=80&w=800",
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800",
    ],
    description: "Spruce top",
    short:
      "Proyección clara y cómoda para tocar en casa o fogón.",
    topWood: "Spruce",
    backSides: "Mahogany",
    neck: "Mahogany",
    fretboard: "Rosewood",
    scale: "25.5\"",
    nutWidth: "1.75\"",
    finish: "Satin",
    discount: 0,
  },

  // Bass (NUEVOS)
  {
    id: "b1",
    name: "Fender Jazz Bass",
    price: 1100,
    stock: 4,
    category: "bajo",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=800",
      "https://images.unsplash.com/photo-1511379938547-9a83f38a0e1b?q=80&w=800",
    ],
    short:
      "Tono definido y cómodo mástil. Un estándar del bajo eléctrico.",
    neck: "Maple",
    fretboard: "Rosewood",
    scale: "34\"",
    finish: "Gloss",
  },
  {
    id: "b2",
    name: "Music Man StingRay",
    price: 1400,
    stock: 2,
    category: "bajo",
    image:
      "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=800",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800",
    ],
    short:
      "Golpe moderno y potente. Electrónica activa y gran pegada.",
    neck: "Maple",
    fretboard: "Maple",
    scale: "34\"",
    finish: "Gloss",
  },
];

function initDB() {
  const db = LS.get("db", null) ?? { products: seed };
  LS.set("db", db);
  return db;
}

export const api = {
  list: async () => initDB().products,
  get: async (id) => initDB().products.find((p) => p.id === id),
  create: async (p) => {
    const db = initDB();
    db.products.push(p);
    LS.set("db", db);
    return p;
  },
  update: async (p) => {
    const db = initDB();
    db.products = db.products.map((x) => (x.id === p.id ? p : x));
    LS.set("db", db);
    return p;
  },
  remove: async (id) => {
    const db = initDB();
    db.products = db.products.filter((x) => x.id !== id);
    LS.set("db", db);
  },
  checkout: async (items) => {
    const db = initDB();
    for (const it of items) {
      const prod = db.products.find((x) => x.id === it.id);
      if (!prod || prod.stock < it.qty)
        throw new Error(`Sin stock: ${prod?.name || it.id}`);
    }
    db.products = db.products.map((p) => {
      const it = items.find((i) => i.id === p.id);
      return it ? { ...p, stock: p.stock - it.qty } : p;
    });
    LS.set("db", db);
    return true;
  },
};

export const priceWithDiscount = (p) =>
  Math.round(Number(p.price || 0) * (1 - (p.discount || 0) / 100));

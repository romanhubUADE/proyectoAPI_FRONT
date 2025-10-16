// src/data/mockApi.js
const LS = {
  get:(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d)),
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
}
const seed = [
  // ELÉCTRICAS
  { id:'1', name:'Stratocaster SSS', price:800, stock:5, category:'eléctrica',
    images:['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80'], description:'Cuerpo aliso', discount:0 },
  { id:'2', name:'Les Paul Standard', price:1200, stock:3, category:'eléctrica',
    images:['https://images.unsplash.com/photo-1516924962500-2b4b3b4f7f12?w=900&q=80'], description:'Tapa arce', discount:10 },

  // ACÚSTICAS
  { id:'3', name:'Acústica Cort', price:450, stock:8, category:'acústica',
    images:['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&q=80'], description:'Spruce top', discount:0 },

  // BAJOS (nuevo)
{
  id: "b1", name: "Fender Jazz Bass",price: 1100,stock: 6,category: "bajo",images: ["https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=900&q=80"],description: "Aliso, single-coil", discount: 0},
{
  id: "b2",name: "Music Man StingRay",price: 1500,stock: 4,category: "bajo",images: ["https://images.unsplash.com/photo-1571333246102-5d36f3c7a853?w=900&q=80"
  ],
  description: "Humbucker",
  discount: 0
}
]
function initDB(){
  const db = LS.get('db', null) ?? { products: seed }
  LS.set('db', db); return db
}
export const api = {
  list: async ()=> initDB().products,
  get:  async (id)=> initDB().products.find(p=>p.id===id),
  create: async (p)=>{ const db=initDB(); db.products.push(p); LS.set('db',db); return p },
  update: async (p)=>{ const db=initDB(); db.products=db.products.map(x=>x.id===p.id?p:x); LS.set('db',db); return p },
  remove: async (id)=>{ const db=initDB(); db.products=db.products.filter(x=>x.id!==id); LS.set('db',db) },
  checkout: async (items)=>{
    const db=initDB()
    for(const it of items){
      const p=db.products.find(x=>x.id===it.id)
      if(!p || p.stock<it.qty) throw new Error(`Sin stock: ${p?.name||it.id}`)
    }
    db.products=db.products.map(p=>{
      const it=items.find(i=>i.id===p.id)
      return it? {...p, stock:p.stock-it.qty}:p
    })
    LS.set('db',db); return true
  }
}
export const priceWithDiscount = (p)=> Math.round(p.price*(1-(p.discount||0)/100))

// src/pages/AdminProducts.jsx
import {useEffect, useState} from 'react'
import {useShop} from '../context/ShopContext'
import {v4 as uuid} from 'uuid'
export default function AdminProducts(){
  const {state:{products}, api} = useShop()
  const [list,setList]=useState([])
  const [form,setForm]=useState({name:'',price:0,stock:0,category:'eléctrica',images:[''],description:'',discount:0})
  const load=()=> api.list().then(setList)
  useEffect(load,[])
  const submit=async(e)=>{ e.preventDefault()
    const data=form.id? form : {...form, id: uuid()}
    await (form.id? api.update(data): api.create(data))
    setForm({name:'',price:0,stock:0,category:'eléctrica',images:[''],description:'',discount:0})
    load()
  }
  const edit=(p)=> setForm({...p})
  const del=async(id)=>{ await api.remove(id); load() }

  return (
    <section style={{padding:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <form onSubmit={submit}>
        <h3>{form.id?'Editar':'Nuevo'} producto</h3>
        <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input type="number" placeholder="Precio" value={form.price} onChange={e=>setForm({...form,price:+e.target.value})}/>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:+e.target.value})}/>
        <input placeholder="Categoría" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
        <input placeholder="URL imagen" value={form.images[0]||''} onChange={e=>setForm({...form,images:[e.target.value]})}/>
        <input type="number" placeholder="Descuento %" value={form.discount} onChange={e=>setForm({...form,discount:+e.target.value})}/>
        <textarea placeholder="Descripción" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <button type="submit">Guardar</button>
      </form>

      <div>
        <h3>Publicaciones</h3>
        {(list.length?list:products).map(p=>(
          <div key={p.id} style={{display:'grid',gridTemplateColumns:'80px 1fr 120px 80px 80px',gap:8,alignItems:'center',marginBottom:8}}>
            <img src={p.images?.[0]} alt="" style={{width:80,height:60,objectFit:'cover'}}/>
            <div>{p.name}</div>
            <div>${p.price} • Stock {p.stock}</div>
            <button onClick={()=>edit(p)}>Editar</button>
            <button onClick={()=>del(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </section>
  )
}

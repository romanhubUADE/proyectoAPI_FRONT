// src/components/Filters.jsx
import {useShop} from '../context/ShopContext'
export default function Filters(){
  const {state:{filters:f}, dispatch} = useShop()
  return (
    <div style={{display:'flex',gap:12,margin:'12px 0'}}>
      <input placeholder="Buscar..." value={f.q} onChange={e=>dispatch({type:'SET_FILTERS',payload:{q:e.target.value}})}/>
      <select value={f.cat} onChange={e=>dispatch({type:'SET_FILTERS',payload:{cat:e.target.value}})}>
        <option value="all">Todas</option>
        <option value="eléctrica">Eléctrica</option>
        <option value="acústica">Acústica</option>
      </select>
      <input type="number" placeholder="Min" value={f.min} onChange={e=>dispatch({type:'SET_FILTERS',payload:{min:+e.target.value||0}})}/>
      <input type="number" placeholder="Max" value={f.max} onChange={e=>dispatch({type:'SET_FILTERS',payload:{max:+e.target.value||99999}})}/>
    </div>
  )
}

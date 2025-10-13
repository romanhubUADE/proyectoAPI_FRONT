// src/pages/CartPage.jsx
import {Link} from 'react-router-dom'
import {useShop} from '../context/ShopContext'
export default function CartPage(){
  const {state:{cart}, dispatch, total} = useShop()
  if(!cart.length) return <section style={{padding:16}}>Carrito vacío</section>
  return (
    <section style={{padding:16}}>
      {cart.map(i=>(
        <div key={i.id} style={{display:'grid',gridTemplateColumns:'1fr 120px 80px 80px',gap:8,alignItems:'center',marginBottom:8}}>
          <div>{i.name}</div>
          <div>${Math.round(i.price*(1-i.discount/100))}</div>
          <input type="number" min="1" value={i.qty} onChange={e=>dispatch({type:'SET_QTY',payload:{id:i.id,qty:+e.target.value}})}/>
          <button onClick={()=>dispatch({type:'REMOVE',payload:i.id})}>Quitar</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <Link to="/checkout"><button>Ir a pagar</button></Link>
    </section>
  )
}

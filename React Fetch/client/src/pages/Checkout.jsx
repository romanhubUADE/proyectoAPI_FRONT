// src/pages/Checkout.jsx
import {useShop} from '../context/ShopContext'
export default function Checkout(){
  const {state:{cart,status,error}, dispatch, total, api} = useShop()
  const confirm = async ()=>{
    dispatch({type:'STATUS',payload:{status:'loading'}})
    try{ await api.checkout(cart); dispatch({type:'CLEAR'}); dispatch({type:'STATUS',payload:{status:'success'}}) }
    catch(e){ dispatch({type:'STATUS',payload:{status:'error',error:e.message}}) }
  }
  return (
    <section style={{padding:16}}>
      <h3>Checkout</h3>
      <p>Total a pagar: ${total}</p>
      <button onClick={confirm} disabled={!cart.length || status==='loading'}>Confirmar compra</button>
      {status==='success' && <p>Compra registrada. Stock descontado.</p>}
      {status==='error' && <p>Error: {error}</p>}
    </section>
  )
}

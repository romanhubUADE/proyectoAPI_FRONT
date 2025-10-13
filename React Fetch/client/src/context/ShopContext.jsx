// src/context/ShopContext.jsx
import {createContext, useContext, useEffect, useMemo, useReducer} from 'react'
import {api, priceWithDiscount} from '../data/mockApi'

const ShopCtx = createContext(null)
const initial = {
  products: [],
  filters: {q:'', cat:'all', min:0, max:99999},
  cart: [], // {id,name,price,discount,qty}
  status: 'idle', error: null
}

function reducer(state, action){
  switch(action.type){
    case 'SET_PRODUCTS': return {...state, products: action.payload}
    case 'SET_FILTERS': return {...state, filters:{...state.filters, ...action.payload}}
    case 'ADD':{
      const p=action.payload
      const i=state.cart.find(x=>x.id===p.id)
      return {...state, cart: i? state.cart.map(x=>x.id===p.id? {...x, qty:x.qty+1}:x)
                                 : [...state.cart, {id:p.id,name:p.name,price:p.price,discount:p.discount||0,qty:1}]}
    }
    case 'REMOVE': return {...state, cart: state.cart.filter(i=>i.id!==action.payload)}
    case 'SET_QTY':{
      const {id,qty}=action.payload
      return {...state, cart: state.cart.map(i=>i.id===id? {...i, qty:qty||1}:i)}
    }
    case 'CLEAR': return {...state, cart: []}
    case 'STATUS': return {...state, status: action.payload.status, error: action.payload.error||null}
    default: return state
  }
}

export function ShopProvider({children}){
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(()=>{ api.list().then(ps=>dispatch({type:'SET_PRODUCTS', payload:ps})) },[])

  const filtered = useMemo(()=>{
    const {q,cat,min,max}=state.filters
    return state.products
      .filter(p=>p.stock>0)
      .filter(p=>cat==='all'||p.category===cat)
      .filter(p=>p.name.toLowerCase().includes(q.toLowerCase()))
      .filter(p=>{ const pr=priceWithDiscount(p); return pr>=min && pr<=max })
  },[state.products,state.filters])

  const total = useMemo(()=> state.cart
    .reduce((t,i)=> t + Math.round(i.price*(1-i.discount/100))*i.qty,0), [state.cart])

  const value = {
    state, dispatch, filtered, total,
    priceWithDiscount,
    api // para Admin y Detail
  }
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}
export const useShop = ()=> useContext(ShopCtx)

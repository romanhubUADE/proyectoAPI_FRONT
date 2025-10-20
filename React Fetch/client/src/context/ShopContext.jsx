// src/context/ShopContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../lib/api";

// Util: precio final con descuento
const priceWithDiscount = (p) =>
  Math.round((Number(p?.price) || 0) * (1 - (Number(p?.discount) || 0) / 100));

const ShopCtx = createContext(null);

const initial = {
  products: [],
  filters: { q: "", cat: "all", min: 0, max: 99999 },
  cart: [],                // {id,name,price,discount,qty}
  status: "idle",
  error: null,
  // para animaciones (badge que rebota al agregar)
  lastAddedId: null,
  lastAddedAt: 0,
};

// normalizador seguro por si el backend envía distintos envoltorios
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "ADD": {
      const p = action.payload;
      const i = state.cart.find((x) => x.id === p.id);
      const nextCart = i
        ? state.cart.map((x) =>
            x.id === p.id ? { ...x, qty: (x.qty || 1) + 1 } : x
          )
        : [
            ...state.cart,
            {
              id: p.id,
              name: p.name,
              price: p.price,
              discount: p.discount || 0,
              qty: 1,
            },
          ];
      return {
        ...state,
        cart: nextCart,
        lastAddedId: p.id,
        lastAddedAt: Date.now(),
      };
    }

    case "REMOVE":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };

    case "SET_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty || 1 } : i
        ),
      };

    case "CLEAR":
      return { ...state, cart: [] };

    case "STATUS":
      return {
        ...state,
        status: action.payload.status,
        error: action.payload.error || null,
      };

    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Carga de productos
  useEffect(() => {
    let alive = true;
    (async () => {
      dispatch({ type: "STATUS", payload: { status: "loading" } });
      try {
        const raw = await api.listProducts();
        const list = toArray(raw);
        if (!alive) return;
        dispatch({ type: "SET_PRODUCTS", payload: list });
        dispatch({ type: "STATUS", payload: { status: "ready" } });
      } catch (e) {
        if (!alive) return;
        console.error("load products failed", e);
        dispatch({ type: "SET_PRODUCTS", payload: [] });
        dispatch({
          type: "STATUS",
          payload: { status: "error", error: String(e?.message || e) },
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Siempre array
  const products = Array.isArray(state.products) ? state.products : [];

  // Filtros del catálogo
  const filtered = useMemo(() => {
    const { q, cat, min, max } = state.filters;
    const qlc = (q || "").toLowerCase();
    return products
      .filter((p) => (Number(p?.stock) || 0) > 0) // ocultar sin stock
      .filter(
        (p) =>
          cat === "all" ||
          String(p?.category || p?.cat || "")
            .toLowerCase()
            .includes(String(cat).toLowerCase())
      )
      .filter((p) => String(p?.name || "").toLowerCase().includes(qlc))
      .filter((p) => {
        const pr = priceWithDiscount(p);
        return pr >= Number(min || 0) && pr <= Number(max || 999999);
      });
  }, [products, state.filters]);

  // Total del carrito
  const total = useMemo(
    () =>
      state.cart.reduce(
        (t, i) =>
          t +
          Math.round(Number(i.price || 0) * (1 - (Number(i.discount) || 0) / 100)) *
            (Number(i.qty) || 1),
        0
      ),
    [state.cart]
  );

  // Helpers de alto nivel para componentes
  const addToCart = (product) => dispatch({ type: "ADD", payload: product });
  const removeFromCart = (id) => dispatch({ type: "REMOVE", payload: id });
  const setCartQty = (id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const value = {
    state,
    dispatch,
    filtered,
    total,
    priceWithDiscount,
    api, // expuesto para vistas admin y detalle
    // helpers
    addToCart,
    removeFromCart,
    setCartQty,
    clearCart,
  };

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export const useShop = () => useContext(ShopCtx);

import { createContext, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addItem,
  removeOne,
  removeAll,
  clearCart,
  setQty,
} from "../redux/cartSlice.js";

import { toast } from "react-toastify";

// Utilidad para aplicar descuento cuando un producto lo tenga
const priceWithDiscount = (p) => {
  const price = Number(p?.price) || 0;
  const discount = Number(p?.discount) || 0;
  if (discount <= 0) return price;
  return Math.round(price - price * (discount / 100));
};

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Carrito desde Redux
  const cart = useSelector((state) => state.cart.items);

  // Acciones del carrito → despachan a Redux
  const addToCart = (product) => {
    dispatch(addItem(product));

    // TOAST: feedback visual no bloqueante al agregar producto
    toast.success(
      `"${product?.name ?? "Producto"}" agregado al carrito`,
      { icon: "🛒" }
    );
  };

  const removeOneFromCart = (id) => dispatch(removeOne(id));
  const removeAllFromCart = (id) => dispatch(removeAll(id));
  const clearCartAll = () => dispatch(clearCart());
  const setCartQty = (id, qty) => dispatch(setQty({ id, qty }));

  // Total calculado automáticamente con Redux
  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      const unit = priceWithDiscount(item);
      const q = Number(item.qty) || 1;
      return acc + unit * q;
    }, 0);
  }, [cart]);

  const value = {
    // Datos del carrito
    cart,
    total,

    // Acciones
    addToCart,
    removeOne: removeOneFromCart,
    removeAll: removeAllFromCart,
    clearCart: clearCartAll,
    setCartQty,

    // Helper
    priceWithDiscount,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);

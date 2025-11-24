// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // cada item: { id, name, price, qty, ... }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
  const p = action.payload;
  if (!p || p.id == null) return;

  const existing = state.items.find((x) => x.id === p.id);

  // Si ya está, solo aumentar cantidad
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
    return;
  }

  // Normalizar imágenes
  const normalizedImage =
    typeof p.image === "string"
      ? p.image
      : p.images?.[0]?.url || p.images?.[0] || null;

  const normalizedImages =
    Array.isArray(p.images)
      ? p.images.map((img) => (typeof img === "string" ? img : img.url))
      : [];

  // Guardar solo lo necesario en el carrito
  state.items.push({
    id: p.id,
    name: p.name,
    price: p.price,
    discount: p.discount || 0,
    qty: 1,

    // Lo que necesita CartPage.jsx para mostrar imágenes
    image: normalizedImage,
    images: normalizedImages,
  });
},
    removeOne(state, action) {
      const id = action.payload;
      const existing = state.items.find((p) => p.id === id);
      if (!existing) return;

      if ((existing.qty || 1) <= 1) {
        state.items = state.items.filter((p) => p.id !== id);
      } else {
        existing.qty = (existing.qty || 1) - 1;
      }
    },
    removeAll(state, action) {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
    setQty(state, action) {
      const { id, qty } = action.payload || {};
      const n = Number(qty);
      if (!Number.isFinite(n) || n <= 0) {
        state.items = state.items.filter((p) => p.id !== id);
        return;
      }
      const existing = state.items.find((p) => p.id === id);
      if (existing) {
        existing.qty = n;
      }
    },
  },
});

export const { addItem, removeOne, removeAll, clearCart, setQty } =
  cartSlice.actions;

export default cartSlice.reducer;

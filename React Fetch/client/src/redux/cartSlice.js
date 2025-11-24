// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ========== HELPERS SESSIONSTORAGE ==========
const CART_KEY = "cart_items";

const loadCartFromSession = () => {
  try {
    const stored = sessionStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToSession = (items) => {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error guardando carrito:", error);
  }
};

// ========== STATE ==========
const initialState = {
  items: loadCartFromSession(), // Rehidrata desde sessionStorage
};

// ========== SLICE ==========
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const p = action.payload;
      if (!p || p.id == null) return;

      const existing = state.items.find((x) => x.id === p.id);

      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        // Normalizar imágenes
        const normalizedImage =
          typeof p.image === "string"
            ? p.image
            : p.images?.[0]?.url || p.images?.[0] || null;

        const normalizedImages = Array.isArray(p.images)
          ? p.images.map((img) => (typeof img === "string" ? img : img.url))
          : [];

        state.items.push({
          id: p.id,
          name: p.name,
          price: p.price,
          discount: p.discount || 0,
          qty: 1,
          image: normalizedImage,
          images: normalizedImages,
        });
      }

      // Persistir en sessionStorage
      saveCartToSession(state.items);
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

      saveCartToSession(state.items);
    },

    removeAll(state, action) {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
      saveCartToSession(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCartToSession(state.items);
    },

    setQty(state, action) {
      const { id, qty } = action.payload || {};
      const n = Number(qty);

      if (!Number.isFinite(n) || n <= 0) {
        state.items = state.items.filter((p) => p.id !== id);
      } else {
        const existing = state.items.find((p) => p.id === id);
        if (existing) {
          existing.qty = n;
        }
      }

      saveCartToSession(state.items);
    },
  },
});

export const { addItem, removeOne, removeAll, clearCart, setQty } =
  cartSlice.actions;

export default cartSlice.reducer;
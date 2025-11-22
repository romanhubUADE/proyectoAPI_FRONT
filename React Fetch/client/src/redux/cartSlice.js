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
      const product = action.payload;
      if (!product || product.id == null) return state;

      const existing = state.items.find((p) => p.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
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

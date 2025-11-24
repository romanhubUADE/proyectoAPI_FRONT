// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import categoriesReducer from './categoriesSlice.js';
import ordersReducer from "./ordersSlice.js";
import cartReducer from "./cartSlice.js";
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
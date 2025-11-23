// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

// === Helpers de auth y errores ===
const getToken = () => localStorage.getItem("token") || "";

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (typeof error?.response?.data === "string") return error.response.data;
  if (error?.message) return error.message;
  return fallback;
};

// ======================= THUNKS =======================

// GET /api/compras/mias
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/compras/mias`, {
        headers: authHeaders(), // ← IMPORTANTE: acá va el token
      });
      return toArray(data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al cargar tus compras")
      );
    }
  }
);

// POST /api/compras
export const createOrder = createAsyncThunk(
  "orders/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/compras`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(), // ← IMPORTANTE: acá va el token
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al crear la compra")
      );
    }
  }
);

// ======================= STATE =======================

const initialState = {
  mine: [],
  mineStatus: "idle", // "idle" | "loading" | "ready" | "error"
  mineError: null,

  createStatus: "idle", // "idle" | "loading" | "ready" | "error"
  createError: null,
  lastCreated: null,
};

// ======================= SLICE =======================

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearMyOrders(state) {
      state.mine = [];
      state.mineStatus = "idle";
      state.mineError = null;
    },
    resetCreateStatus(state) {
      state.createStatus = "idle";
      state.createError = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMyOrders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.mineStatus = "loading";
        state.mineError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.mine = Array.isArray(action.payload) ? action.payload : [];
        state.mineStatus = "ready";
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.mine = [];
        state.mineStatus = "error";
        state.mineError =
          action.payload ||
          action.error?.message ||
          "Error al cargar tus compras";
      });

    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = "ready";
        state.lastCreated = action.payload ?? null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = "error";
        state.createError =
          action.payload ||
          action.error?.message ||
          "Error al crear la compra";
      });
  },
});

export const { clearMyOrders, resetCreateStatus } = ordersSlice.actions;

export default ordersSlice.reducer;

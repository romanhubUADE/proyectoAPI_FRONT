// src/redux/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

// ========== HELPERS ==========
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

// ========== THUNKS ==========

// GET /api/categories (público)
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/categories`);
      return toArray(data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al cargar categorías")
      );
    }
  }
);

// POST /api/categories (requiere token ADMIN)
export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("No autenticado");

      const { data } = await axios.post(
        `${API_BASE}/categories`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al crear categoría")
      );
    }
  }
);

// ========== STATE ==========
const initialState = {
  items: [],
  status: "idle",
  error: null,

  createStatus: "idle",
  createError: null,
};

// ========== SLICE ==========
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategories(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    resetCreateStatus(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = "ready";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.items = [];
        state.status = "error";
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al cargar categorías";
      });

    // createCategory
    builder
      .addCase(createCategory.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        const created = action.payload;
        if (created) {
          state.items.push(created);
        }
        state.createStatus = "ready";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createStatus = "error";
        state.createError =
          action.payload ||
          action.error?.message ||
          "Error al crear categoría";
      });
  },
});

export const { clearCategories, resetCreateStatus } = categoriesSlice.actions;
export default categoriesSlice.reducer;
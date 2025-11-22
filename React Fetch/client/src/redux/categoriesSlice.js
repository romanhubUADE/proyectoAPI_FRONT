// src/redux/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

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

// Traer todas las categorías
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/categories`, {
        headers: {
          ...authHeaders(),
        },
      });
      return toArray(data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al cargar categorías")
      );
    }
  }
);

// Crear una nueva categoría (solo admin)
export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...authHeaders(),
      };
      const { data } = await axios.post(
        `${API_BASE}/categories`,
        payload,
        { headers }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al crear categoría")
      );
    }
  }
);

const initialState = {
  items: [],
  status: "idle",        // "idle" | "loading" | "ready" | "error"
  error: null,

  createStatus: "idle",  // "idle" | "loading" | "ready" | "error"
  createError: null,
};

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

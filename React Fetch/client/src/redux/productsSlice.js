// src/redux/productsSlice.js
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
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

// ======================= THUNKS =======================

// GET /products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/products`);
      return toArray(data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al cargar productos"
      );
    }
  }
);

// GET /products/:id
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/products/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al cargar el producto"
      );
    }
  }
);

// POST /products  (JSON, sin imágenes)
export const createProduct = createAsyncThunk(
  "products/create",
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/products`, product, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al crear producto"
      );
    }
  }
);

// PATCH /products/:id
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data: body }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE}/products/${id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al actualizar producto"
      );
    }
  }
);

// DELETE /products/:id
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: authHeaders(),
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al eliminar producto"
      );
    }
  }
);

// POST /products/:id/images  (subir una o varias imágenes)
export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async ({ id, files }, { rejectWithValue }) => {
    try {
      // El backend espera @RequestParam("file") MultipartFile file
      // → mandamos una request por archivo.
      for (const f of files || []) {
        if (!f) continue;
        const formData = new FormData();
        formData.append("file", f);

        await axios.post(`${API_BASE}/products/${id}/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...authHeaders(),
          },
        });
      }

      // Podríamos devolver info extra si hiciera falta;
      // de momento alcanza con el id del producto.
      return { id };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Error al subir imágenes"
      );
    }
  }
);

// ======================= STATE =======================

const initialState = {
  items: [],
  current: null,

  status: "idle",
  error: null,

  currentStatus: "idle",
  currentError: null,

  saveStatus: "idle",
  saveError: null,

  deleteStatus: "idle",
  deleteError: null,

  uploadStatus: "idle",
  uploadError: null,
};

// ======================= SLICE =======================

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.currentStatus = "idle";
      state.currentError = null;
    },
    resetSaveStatus(state) {
      state.saveStatus = "idle";
      state.saveError = null;
    },
    resetDeleteStatus(state) {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = toArray(action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentStatus = "ready";
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentStatus = "error";
        state.currentError = action.payload;
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.current = action.payload;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload;
      });

    // updateProduct
    builder
      .addCase(updateProduct.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.current = action.payload;
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload;
      });

    // deleteProduct
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });

    // uploadProductImages
    builder
      .addCase(uploadProductImages.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadProductImages.fulfilled, (state) => {
        state.uploadStatus = "succeeded";
        // Si quisieras, acá podrías hacer un refetch del producto
        // o actualizar manualmente current/images.
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      });
  },
});

export const {
  clearCurrent,
  resetSaveStatus,
  resetDeleteStatus,
} = productsSlice.actions;

export default productsSlice.reducer;

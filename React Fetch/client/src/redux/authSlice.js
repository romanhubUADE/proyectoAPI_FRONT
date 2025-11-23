// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api/v1";

// Helpers para token
const getToken = () => localStorage.getItem("token") || "";
const saveToken = (t) => localStorage.setItem("token", t);
const clearToken = () => localStorage.removeItem("token");

// --- LOGIN ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/v1/auth/authenticate`, {
        email,
        password,
      });

      const token = data?.accessToken;
      if (!token) throw new Error("Token no recibido.");

      saveToken(token);

      // el slice usa action.payload.token
      return { token, user: null };
    } catch (error) {
      if (error?.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Error al iniciar sesión");
    }
  }
);



// --- REGISTER ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/v1/auth/register`, payload);
      // hoy solo usás registerStatus / registerError, así que alcanza con devolver data
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Error al registrarse");
    }
  }
);



// --- GET ME ---
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("No hay token.");

      const { data } = await axios.get(`${API_BASE}/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data; // UserResponseDTO
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al obtener usuario"
      );
    }
  }
);



const initialState = {
  token: getToken() || null,
  user: null,
  isAuth: !!getToken(),
  isAdmin: false,

  status: "idle",
  error: null,

  registerStatus: "idle",
  registerError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.isAdmin = false;
      clearToken();
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "ready";
        state.token = action.payload.token;
        state.isAuth = true;

        // Si tu token ya incluye info del usuario:
        const payloadUser =
          action.payload.user ||
          action.payload.usuario ||
          null;

        state.user = payloadUser;

        state.isAdmin = Boolean(
          payloadUser?.role === "admin" ||
            payloadUser?.isAdmin ||
            payloadUser?.rol === "ADMIN"
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Error al iniciar sesión";
        state.isAuth = false;
      });

    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = "ready";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "error";
        state.registerError =
          action.payload || "Error al registrarse";
      });

    // FETCH ME
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "ready";
        state.user = action.payload;
        state.isAuth = true;

        state.isAdmin = Boolean(
          action.payload?.role === "admin" ||
            action.payload?.isAdmin ||
            action.payload?.rol === "ADMIN"
        );
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = "idle";
        state.isAuth = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

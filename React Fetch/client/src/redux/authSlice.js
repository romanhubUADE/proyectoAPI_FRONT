// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";



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

      return { token };
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
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al registrarse"
      );
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

      return data;
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

        const decoded = jwtDecode(action.payload.token);

        state.user = { email: decoded.sub, role: decoded.role };
        state.isAdmin = decoded.role === "ADMIN";
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
        state.registerError = action.payload;
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
        state.isAdmin = action.payload?.role === "ADMIN";
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = "idle";
        state.isAuth = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

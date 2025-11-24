// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4002/api";

// ========== HELPERS SESSIONSTORAGE ==========
// Solo se usan para rehidratar al arrancar y guardar al login
const getStoredToken = () => sessionStorage.getItem("token") || null;
const saveStoredToken = (t) => sessionStorage.setItem("token", t);
const clearStoredToken = () => sessionStorage.removeItem("token");

// ========== THUNKS ==========

// LOGIN: autentica y guarda token en Redux + sessionStorage
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

      // Guardar en sessionStorage para rehidratación
      saveStoredToken(token);

      return { token };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }
);

// REGISTER: crea usuario
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

// FETCH ME: obtiene datos del usuario autenticado
// IMPORTANTE: usa getState() para obtener el token desde Redux
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Leer token desde Redux store (no desde sessionStorage)
      const token = getState().auth.token;
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

// ========== INITIAL STATE ==========
// Rehidrata token desde sessionStorage al cargar la app
const storedToken = getStoredToken();

const initialState = {
  token: storedToken,
  user: null,
  isAuth: !!storedToken,
  isAdmin: false,

  status: "idle",
  error: null,

  registerStatus: "idle",
  registerError: null,
};

// ========== SLICE ==========
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      state.isAdmin = false;
      clearStoredToken(); // Limpiar sessionStorage
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
        const role =
          decoded.role ||
          (Array.isArray(decoded.authorities) ? decoded.authorities[0] : null);

        state.user = {
          email: decoded.sub,
          role,
        };
        state.isAdmin = role === "ADMIN";
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
        state.isAuth = true;

        const baseUser = action.payload || null;
        let role = null;

        if (state.token) {
          try {
            const decoded = jwtDecode(state.token);
            role =
              decoded.role ||
              (Array.isArray(decoded.authorities)
                ? decoded.authorities[0]
                : null);

            state.user = {
              ...(baseUser || {}),
              email: decoded.sub ?? baseUser?.email,
              role,
            };
          } catch {
            state.user = baseUser;
          }
        } else {
          state.user = baseUser;
        }

        state.isAdmin = role === "ADMIN";
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = "idle";
        state.isAuth = false;
        state.isAdmin = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
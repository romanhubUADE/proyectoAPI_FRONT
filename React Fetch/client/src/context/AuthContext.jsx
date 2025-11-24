// src/context/AuthContext.jsx
import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  logout as logoutAction,
} from "../redux/authSlice.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const {
    user,
    token,
    isAuth,
    isAdmin,
    status,
    error,
    registerStatus,
    registerError,
  } = useSelector((s) => s.auth);

  const login = (email, password) =>
    dispatch(loginUser({ email, password }));

  const register = (payload) => dispatch(registerUser(payload));

  const logout = () => dispatch(logoutAction());

  const value = {
    user,
    token,
    isAuth,
    isAdmin,
    status,
    error,
    registerStatus,
    registerError,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
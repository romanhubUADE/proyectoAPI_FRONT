// src/auth/RoleContext.jsx
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const RoleCtx = createContext();

export function RoleProvider({ children }) {
  const { isAdmin } = useSelector((s) => s.auth);

  const value = {
    role: isAdmin ? "ADMIN" : "USER",
  };

  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export const useRole = () => useContext(RoleCtx);

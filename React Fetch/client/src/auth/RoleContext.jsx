import { createContext, useContext, useMemo, useState } from "react";

const RoleCtx = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(
    localStorage.getItem("role") || "USER"
  );
  const toggle = () => {
    const next = role === "ADMIN" ? "USER" : "ADMIN";
    setRole(next);
    localStorage.setItem("role", next);
  };
  const value = useMemo(() => ({ role, setRole, toggle }), [role]);
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export const useRole = () => useContext(RoleCtx);
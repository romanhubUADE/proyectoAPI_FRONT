// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json || {};
  } catch {
    return {};
  }
}

// normaliza authorities desde distintos layouts de payload
function pickAuthorities(user) {
  if (!user) return [];
  if (Array.isArray(user.authorities)) return user.authorities.map(String);
  if (Array.isArray(user.roles))       return user.roles.map(String);
  if (typeof user.scope === "string")  return user.scope.split(" ").map(String);
  if (typeof user.role  === "string")  return [user.role];
  return [];
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user,  setUser]  = useState(() => (token ? decodeJwt(token) : null));

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken);
    // nunca escribir localStorage.role
    setToken(accessToken);
    setUser(decodeJwt(accessToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // limpia flag simulado si existiera
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) setUser(decodeJwt(token));
  }, [token]);

  const authorities = useMemo(() => pickAuthorities(user), [user]);
  const isAdmin = useMemo(() => authorities.includes("ADMIN"), [authorities]);

  const value = useMemo(
    () => ({ token, user, login, logout, isAuth: !!token, authorities, isAdmin }),
    [token, user, authorities, isAdmin]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

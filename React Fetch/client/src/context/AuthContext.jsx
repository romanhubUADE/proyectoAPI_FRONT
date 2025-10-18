import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json || {};
  } catch { return {}; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser]   = useState(() => token ? decodeJwt(token) : null);

  const login = (accessToken) => {
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(decodeJwt(accessToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // refresca user si cambia token
  useEffect(() => { if (token) setUser(decodeJwt(token)); }, [token]);

  const value = useMemo(() => ({ token, user, login, logout, isAuth: !!token }), [token, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

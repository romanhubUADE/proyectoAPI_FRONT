// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useRole } from "../auth/RoleContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { isAuth } = useAuth();
  const { role: current } = useRole();
  const location = useLocation();

  // Rutas solo-admin: basta con que el RoleContext sea ADMIN
  if (role === "ADMIN") {
    return current === "ADMIN" ? children : <Navigate to="/" replace />;
  }

  // Rutas protegidas normales: requieren sesión
  return isAuth
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}
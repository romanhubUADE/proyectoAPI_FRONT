// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { isAuth, isAdmin } = useAuth();
  const location = useLocation();

  if (role === "ADMIN") {
    return isAdmin ? children : <Navigate to="/login" replace state={{ from: location }} />;
  }
  return isAuth ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

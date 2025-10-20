
import { Navigate } from "react-router-dom";
import { useRole } from "./RoleContext";

export default function AdminRoute({ children }) {
  const { role } = useRole();
  return role === "ADMIN" ? children : <Navigate to="/" replace />;
}
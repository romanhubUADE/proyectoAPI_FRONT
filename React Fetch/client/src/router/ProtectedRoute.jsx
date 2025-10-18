import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, role }) {
  const { isAuth, user } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (role) {
    const roles = user?.authorities || user?.roles || user?.scope || [];
    const has = Array.isArray(roles) ? roles.includes(role) : String(roles).includes(role);
    if (!has) return <Navigate to="/" replace />;
  }
  return children;
}

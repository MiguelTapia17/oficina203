import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ allow = [], children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.rol || "").toLowerCase();
  const allowed = allow.map((r) => String(r).toLowerCase());

  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

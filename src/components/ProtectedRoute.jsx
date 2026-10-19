import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ adminOnly = false }) {
  const { loading, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <p className="empty-state">กำลังตรวจสอบสิทธิ์...</p>;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

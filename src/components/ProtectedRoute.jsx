import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Do NOTHING until auth hydration finishes
  if (loading) {
    return null;
  }

  // 🔐 Not authenticated → go to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: location.pathname }}
      />
    );
  }

  // ✅ Authenticated → allow access
  return children;
}

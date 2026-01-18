import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth is hydrating, render nothing (prevents flash + redirect loops)
  if (loading) return null;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth to resolve
  if (loading) {
    return null;
  }

  // 🔐 Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

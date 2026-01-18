import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait for auth hydration (never blank)
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>Loading…</div>
      </div>
    );
  }

  // 🔐 Not authenticated → go to login with full return URL
  if (!user) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo }}
      />
    );
  }

  // ✅ Authenticated → allow access
  return children;
}

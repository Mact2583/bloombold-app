import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 🔒 Block rendering until auth is known
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Checking session…
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → allow page to decide
  return <Outlet />;
}

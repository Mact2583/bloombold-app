import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  // ⛔️ DO NOT REDIRECT while loading
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}





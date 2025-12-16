import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="p-10">Checking session…</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}




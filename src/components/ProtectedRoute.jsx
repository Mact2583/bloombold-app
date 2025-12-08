import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/SupabaseAuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing until we know session status
  if (loading) return <div>Loading...</div>;

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logout from "@/pages/Logout";

// Public pages
import Login from "@/pages/Login";

// Protected layout + pages
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import ResumeReview from "@/pages/dashboard/ResumeReview";

export default function App() {
  console.log("🔥 BloomBold App.jsx v2026-01-17 🔥");

  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Root: always force auth */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="resume-review" element={<ResumeReview />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import Logout from "@/pages/Logout";

// Public pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AuthCallback from "@/pages/auth/Callback";

// Protected pages
import Dashboard from "@/pages/dashboard/Dashboard";
import ResumeReview from "@/pages/ResumeReview";

export default function App() {
  console.log("🔥 BloomBold App.jsx v2026-01-17 🔥");

  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Root – force login for soft launch */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume-review"
            element={
              <ProtectedRoute>
                <ResumeReview />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

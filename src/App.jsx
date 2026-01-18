import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import ResumeReview from "@/pages/ResumeReview";
import Logout from "@/pages/Logout";
import Dashboard from "@/pages/dashboard/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Entry */}
          <Route path="/" element={<Navigate to="/resume-review" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Explicit catch — do NOT redirect blindly */}
          <Route
            path="*"
            element={<Navigate to="/resume-review" replace />}
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

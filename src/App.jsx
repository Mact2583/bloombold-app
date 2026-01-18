import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import ResumeReview from "@/pages/ResumeReview";

import Dashboard from "@/pages/dashboard/Dashboard";
import ResumeReviewDetail from "@/pages/dashboard/ResumeReviewDetail";
import ResumeReviewHistory from "@/pages/dashboard/ResumeReviewHistory";
import Upgrade from "@/pages/dashboard/Upgrade";

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

          <Route
            path="/dashboard/resume-reviews"
            element={
              <ProtectedRoute>
                <ResumeReviewHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/resume-reviews/:id"
            element={
              <ProtectedRoute>
                <ResumeReviewDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/upgrade"
            element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/resume-review" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

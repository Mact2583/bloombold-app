import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Logout from "@/pages/Logout";
import ResumeReview from "@/pages/ResumeReview";

import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import ResumeReviewHistory from "@/pages/dashboard/ResumeReviewHistory";
import ResumeReviewDetail from "@/pages/dashboard/ResumeReviewDetail";
import Upgrade from "@/pages/dashboard/Upgrade";
import Billing from "@/pages/dashboard/Billing";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="resume-reviews"
              element={<ResumeReviewHistory />}
            />
            <Route
              path="resume-reviews/:id"
              element={<ResumeReviewDetail />}
            />
            <Route path="upgrade" element={<Upgrade />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { Analytics } from "@vercel/analytics/react";
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
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Entry */}
          <Route path="/" element={<Navigate to="/resume-review" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="resume-reviews" element={<ResumeReviewHistory />} />
            <Route path="resume-reviews/:id" element={<ResumeReviewDetail />} />
            <Route path="upgrade" element={<Upgrade />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/resume-review" replace />} />
        </Routes>

        {/* ✅ Analytics goes HERE */}
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

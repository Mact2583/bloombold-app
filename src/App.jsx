import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react";

// Public
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Logout from "@/pages/Logout";
import ResumeReview from "@/pages/ResumeReview";

// Dashboard layout + pages
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import ResumeReviewHistory from "@/pages/dashboard/ResumeReviewHistory";
import ResumeReviewDetail from "@/pages/dashboard/ResumeReviewDetail";
import Upgrade from "@/pages/dashboard/Upgrade";
import Billing from "@/pages/dashboard/Billing";
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";

// “Tools / Coming soon” pages (make sure these files exist)
import Resume from "@/pages/dashboard/Resume";
import Interview from "@/pages/dashboard/Interview";
import Journal from "@/pages/dashboard/Journal";
import Mentor from "@/pages/dashboard/Mentor";

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

          {/* Protected dashboard (ALL child routes live here) */}
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

            {/* Tools / Coming soon */}
            <Route path="resume" element={<Resume />} />
            <Route path="interview" element={<Interview />} />
            <Route path="journal" element={<Journal />} />
            <Route path="mentor" element={<Mentor />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/resume-review" replace />} />
        </Routes>

        {/* Vercel Analytics should be rendered once, outside Routes is fine */}
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

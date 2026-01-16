import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/SupabaseAuthContext.jsx";

// Public pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Logout from "@/pages/Logout";
import AuthCallback from "@/pages/auth/Callback";
import ResumeReview from "@/pages/ResumeReview";

// Protected routing
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// Dashboard pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Resume from "@/pages/dashboard/Resume";
import Interview from "@/pages/dashboard/Interview";
import Journal from "@/pages/dashboard/Journal";
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";
import Billing from "@/pages/dashboard/Billing";

// Resume review flow
import ResumeReviewHistory from "@/pages/dashboard/ResumeReviewHistory";
import ResumeReviewDetail from "@/pages/dashboard/ResumeReviewDetail";
import ResumeReviewExport from "@/pages/dashboard/ResumeReviewExport";

// Upgrade
import Upgrade from "@/pages/dashboard/Upgrade";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* =====================
              Public Routes
          ====================== */}
          import { Navigate } from "react-router-dom";
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public MVP entry */}
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* =====================
              Protected App
          ====================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>

              {/* Dashboard home */}
              <Route index element={<Dashboard />} />

              {/* Resume reviews */}
              <Route path="resume-reviews" element={<ResumeReviewHistory />} />
              <Route path="resume-reviews/:id" element={<ResumeReviewDetail />} />
              <Route
                path="resume-reviews/:id/export"
                element={<ResumeReviewExport />}
              />

              {/* Billing / Upgrade */}
              <Route path="upgrade" element={<Upgrade />} />
              <Route path="billing" element={<Billing />} />

              {/* Other tools */}
              <Route path="resume" element={<Resume />} />
              <Route path="interview" element={<Interview />} />
              <Route path="journal" element={<Journal />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

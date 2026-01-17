import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/SupabaseAuthContext.jsx";

// Public pages
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
import Upgrade from "@/pages/dashboard/Upgrade";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🔐 FORCE LOGIN ON ROOT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Public MVP */}
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="resume" element={<Resume />} />
              <Route path="interview" element={<Interview />} />
              <Route path="journal" element={<Journal />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/SupabaseAuthContext.jsx";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AuthCallback from "@/pages/auth/Callback";
import ResumeReview from "@/pages/ResumeReview";

// Protected Components
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// Dashboard Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Resume from "@/pages/dashboard/Resume";
import Interview from "@/pages/dashboard/Interview";
import Journal from "@/pages/dashboard/Journal";
import Profile from "@/pages/dashboard/Profile";
import Settings from "@/pages/dashboard/Settings";
import Billing from "@/pages/dashboard/Billing";

// Logout
import Logout from "@/pages/Logout";

function App() {
  return (
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* MVP PUBLIC ROUTE */}
          <Route path="/resume-review" element={<ResumeReview />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;











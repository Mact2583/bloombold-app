import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/SupabaseAuthContext.jsx";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Logout from "@/pages/Logout";
import AuthCallback from "@/pages/auth/Callback";

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 🔐 Protected Routes */}
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
    </AuthProvider>
  );
}

export default App;









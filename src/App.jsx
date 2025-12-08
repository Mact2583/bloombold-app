import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/SupabaseAuthContext.jsx";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// OAuth Callback Page
import AuthCallback from "@/pages/AuthCallback";

// Protected Dashboard Pages
import Tools from "@/pages/Tools";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Supabase OAuth Callback Handler (silent redirect) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/tools"
            element={
              <ProtectedRoute>
                <Tools />
              </ProtectedRoute>
            }
          />

          {/* Future protected dashboard pages: */}
          {/* 
          <Route
            path="/dashboard/mentor"
            element={
              <ProtectedRoute>
                <Mentor />
              </ProtectedRoute>
            }
          />
          */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;







import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "@/pages/Login";
import ResumeReview from "@/pages/ResumeReview";
import Logout from "@/pages/Logout";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Entry */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected */}
          <Route
            path="/resume-review"
            element={
              <ProtectedRoute>
                <ResumeReview />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

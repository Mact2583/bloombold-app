import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BookOpen,
  User,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, isPro } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-indigo-600">
          BloomBold
        </h1>

        <nav className="flex flex-col gap-3">
          <NavLink to="/dashboard" className="nav-link">
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/dashboard/resume" className="nav-link">
            <FileText size={18} /> Resume Builder
          </NavLink>

          <NavLink to="/dashboard/resume-reviews" className="nav-link">
            <FileText size={18} /> Resume Reviews
          </NavLink>

          <NavLink to="/dashboard/interview" className="nav-link">
            <Mic size={18} /> Interview Prep
          </NavLink>

          <NavLink to="/dashboard/journal" className="nav-link">
            <BookOpen size={18} /> Career Journal
          </NavLink>

          <NavLink to="/dashboard/profile" className="nav-link">
            <User size={18} /> Profile
          </NavLink>

          <NavLink to="/dashboard/settings" className="nav-link">
            <Settings size={18} /> Settings
          </NavLink>

          <NavLink to="/dashboard/billing" className="nav-link">
            <CreditCard size={18} /> Billing
          </NavLink>
        </nav>

        <div className="flex-1" />

        <NavLink to="/logout" className="nav-link text-red-600">
          <LogOut size={18} /> Logout
        </NavLink>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">
            Dashboard
          </h2>

          <div className="flex items-center gap-3">
            {isPro && (
              <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                Pro
              </span>
            )}

            <div className="text-gray-600 bg-white shadow px-4 py-2 rounded-md">
              {user?.email}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

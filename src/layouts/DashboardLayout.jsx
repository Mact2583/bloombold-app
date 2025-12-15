import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

// Icons
import {
  LayoutDashboard,
  FileText,
  Mic,
  BookOpen,
  User,
  Settings as SettingsIcon,
  CreditCard,
  LogOut,
} from "lucide-react";

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-indigo-600">BloomBold</h1>

        <nav className="flex flex-col gap-3">

          <NavLink to="/dashboard" className="nav-link">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              Dashboard
            </div>
          </NavLink>

          <NavLink to="/resume" className="nav-link">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Resume Builder
            </div>
          </NavLink>

          <NavLink to="/interview" className="nav-link">
            <div className="flex items-center gap-2">
              <Mic size={18} />
              Interview Prep
            </div>
          </NavLink>

          <NavLink to="/journal" className="nav-link">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              Career Journal
            </div>
          </NavLink>

          <NavLink to="/profile" className="nav-link">
            <div className="flex items-center gap-2">
              <User size={18} />
              Profile
            </div>
          </NavLink>

          <NavLink to="/settings" className="nav-link">
            <div className="flex items-center gap-2">
              <SettingsIcon size={18} />
              Settings
            </div>
          </NavLink>

          <NavLink to="/billing" className="nav-link">
            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              Billing
            </div>
          </NavLink>

        </nav>

        {/* Spacer pushes logout to bottom */}
        <div className="flex-1"></div>

        <NavLink
          to="/logout"
          className="nav-link mt-auto text-red-600 hover:bg-red-50"
        >
          <div className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </div>
        </NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Welcome</h2>
          <div className="text-gray-600 bg-white shadow px-4 py-2 rounded-md">
            {user?.email}
          </div>
        </header>

        {/* Routed page content */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

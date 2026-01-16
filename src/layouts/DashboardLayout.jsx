import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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

function DashboardHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />
      <div className="h-10 w-56 rounded bg-muted animate-pulse" />
    </div>
  );
}

const DashboardLayout = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const pageTitleMap = {
    "/dashboard": "Dashboard",
    "/dashboard/resume": "Resume Builder",
    "/dashboard/resume-reviews": "Resume Reviews",
    "/dashboard/interview": "Interview Prep",
    "/dashboard/journal": "Career Journal",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
    "/dashboard/billing": "Billing",
  };

  const pageTitle =
    pageTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#F7F8FD]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8 text-[#7D77DF]">
          BloomBold
        </h1>

        <nav className="flex flex-col gap-2 text-sm">
          {[
            { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/dashboard/resume", icon: FileText, label: "Resume Builder" },
            { to: "/dashboard/resume-reviews", icon: FileText, label: "Resume Reviews" },
            { to: "/dashboard/interview", icon: Mic, label: "Interview Prep" },
            { to: "/dashboard/journal", icon: BookOpen, label: "Career Journal" },
            { to: "/dashboard/profile", icon: User, label: "Profile" },
            { to: "/dashboard/settings", icon: Settings, label: "Settings" },
            { to: "/dashboard/billing", icon: CreditCard, label: "Billing" },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 transition
                 ${
                   isActive
                     ? "bg-[#EEF0FF] text-[#3730A3] font-medium"
                     : "text-gray-700 hover:bg-gray-100"
                 }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <NavLink
          to="/logout"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </NavLink>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {loading ? (
          <DashboardHeaderSkeleton />
        ) : (
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              {pageTitle}
            </h2>

            <div className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-md">
              {user?.email || " "}
            </div>
          </header>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

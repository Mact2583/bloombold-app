import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Tooltip from "@/components/Tooltip";
import {
  LayoutDashboard,
  FileText,
  Mic,
  BookOpen,
  User,
  Settings,
  CreditCard,
  LogOut,
  Lock,
} from "lucide-react";

const PRO_TOOLTIP =
  "Available with BloomBold Pro — unlimited reviews, full history, and future tools.";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, loading, isPro, signOut } = useAuth();

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

  const pageTitle = pageTitleMap[location.pathname] || "Dashboard";

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/resume", icon: FileText, label: "Resume Builder", pro: true },
    { to: "/dashboard/resume-reviews", icon: FileText, label: "Resume Reviews" },
    { to: "/dashboard/interview", icon: Mic, label: "Interview Prep", pro: true },
    { to: "/dashboard/journal", icon: BookOpen, label: "Career Journal", pro: true },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
    { to: "/dashboard/settings", icon: Settings, label: "Settings" },
    { to: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F8FD]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8 text-[#7D77DF]">
          BloomBold
        </h1>

        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map(({ to, icon: Icon, label, pro }) => {
            const locked = pro && !isPro;

            const link = (
              <NavLink
                to={locked ? "#" : to}
                onClick={(e) => locked && e.preventDefault()}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2 transition
                  ${
                    isActive
                      ? "bg-[#EEF0FF] text-[#3730A3] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${locked ? "cursor-not-allowed opacity-80" : ""}`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {label}
                </div>

                {locked && <Lock size={14} className="text-gray-400" />}
              </NavLink>
            );

            return locked ? (
              <Tooltip key={to} label={PRO_TOOLTIP}>
                {link}
              </Tooltip>
            ) : (
              <div key={to}>{link}</div>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {loading ? (
          <div className="h-10 w-48 rounded bg-muted animate-pulse mb-8" />
        ) : (
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-gray-900">
                {pageTitle}
              </h2>

              {isPro && (
                <span className="rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-medium text-[#3730A3]">
                  Pro
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-md">
              {user?.email}
            </div>
          </header>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

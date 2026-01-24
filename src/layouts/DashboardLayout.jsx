import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";
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
  Sparkles,
  Lock,
} from "lucide-react";

function DashboardHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-8 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-10 w-56 rounded bg-muted" />
    </div>
  );
}

const pageTitleMap = {
  "/dashboard": "Dashboard",
  "/dashboard/resume-reviews": "Resume Reviews",
  "/dashboard/resume": "Resume Builder",
  "/dashboard/interview": "Interview Prep",
  "/dashboard/journal": "Career Journal",
  "/dashboard/mentor": "AI Career Mentor",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
  "/dashboard/billing": "Billing",
  "/dashboard/upgrade": "Upgrade",
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isPro } = useAuth();

  const pageTitle = pageTitleMap[location.pathname] || "Dashboard";

  const navSections = [
    {
      label: "CORE",
      items: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/dashboard/resume-reviews", icon: FileText, label: "Resume Reviews" },
      ],
    },
    {
      label: "TOOLS",
      items: [
        { to: "/dashboard/resume", icon: FileText, label: "Resume Builder", proOnly: true },
        { to: "/dashboard/interview", icon: Mic, label: "Interview Prep", proOnly: true },
        { to: "/dashboard/journal", icon: BookOpen, label: "Career Journal", proOnly: true },
        { to: "/dashboard/mentor", icon: Sparkles, label: "AI Career Mentor", proOnly: true },
      ],
    },
    {
      label: "ACCOUNT",
      items: [
        { to: "/dashboard/profile", icon: User, label: "Profile" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
        { to: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      ],
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FD]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 px-6 py-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#7D77DF]">BloomBold</h1>
          <p className="text-xs text-gray-500 mt-1">Clarity, not templates.</p>
        </div>

        <nav className="flex flex-col gap-6 text-sm">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="text-xs font-semibold tracking-wide text-gray-400 mb-2">
                {section.label}
              </div>

              <div className="flex flex-col gap-1">
                {section.items.map(({ to, icon: Icon, label, proOnly }) => {
                  const isLocked = proOnly && !isPro;

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-md px-3 py-2 transition
                        ${
                          isActive
                            ? "bg-[#EEF0FF] text-[#3730A3] font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} />
                        {label}
                      </span>

                      {isLocked && (
                        <Tooltip text="Included with Pro — click to preview what’s coming.">
                          <span className="inline-flex items-center text-gray-400">
                            <Lock size={16} />
                          </span>
                        </Tooltip>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {loading ? (
          <DashboardHeaderSkeleton />
        ) : (
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-gray-900">{pageTitle}</h2>

              {isPro && (
                <span className="rounded-full bg-[#EEF0FF] text-[#3730A3] text-xs font-semibold px-3 py-1">
                  Pro
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-md">
              {user?.email || " "}
            </div>
          </header>
        )}

        <Outlet />
      </main>
    </div>
  );
}

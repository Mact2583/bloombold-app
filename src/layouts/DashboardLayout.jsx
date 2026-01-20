import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  Lock,
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
  const navigate = useNavigate();
  const { user, isPro, loading } = useAuth();

  const pageTitleMap = {
    "/dashboard": "Dashboard",
    "/dashboard/resume": "Resume Builder",
    "/dashboard/resume-reviews": "Resume Reviews",
    "/dashboard/interview": "Interview Prep",
    "/dashboard/journal": "Career Journal",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
    "/dashboard/billing": "Billing",
    "/dashboard/upgrade": "Upgrade",
  };

  const pageTitle =
    pageTitleMap[location.pathname] || "Dashboard";

  const NavItem = ({
    to,
    icon: Icon,
    label,
    requiresPro = false,
  }) => {
    const locked = requiresPro && !isPro;

    if (locked) {
      return (
        <button
          onClick={() => navigate("/dashboard/upgrade")}
          className="group flex items-center justify-between w-full rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} />
            <span>{label}</span>
          </div>

          <div className="relative">
            <Lock size={14} />
            <span className="absolute right-0 top-full mt-2 hidden group-hover:block w-56 rounded-md bg-white border border-gray-200 p-3 text-xs text-gray-600 shadow-lg z-50">
              Unlock this tool with BloomBold Pro.
            </span>
          </div>
        </button>
      );
    }

    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-md px-3 py-2 transition text-sm
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
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FD]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8 text-[#7D77DF]">
          BloomBold
        </h1>

        <nav className="flex flex-col gap-6">
          {/* Core */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Core
            </p>

            <NavItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />

            <NavItem
              to="/dashboard/resume-reviews"
              icon={FileText}
              label="Resume Reviews"
            />
          </div>

          {/* Tools */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Tools
            </p>

            <NavItem
              to="/dashboard/resume"
              icon={FileText}
              label="Resume Builder"
              requiresPro
            />

            <NavItem
              to="/dashboard/interview"
              icon={Mic}
              label="Interview Prep"
              requiresPro
            />

            <NavItem
              to="/dashboard/journal"
              icon={BookOpen}
              label="Career Journal"
              requiresPro
            />
          </div>

          {/* Account */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Account
            </p>

            <NavItem
              to="/dashboard/profile"
              icon={User}
              label="Profile"
            />

            <NavItem
              to="/dashboard/settings"
              icon={Settings}
              label="Settings"
            />

            <NavItem
              to="/dashboard/billing"
              icon={CreditCard}
              label="Billing"
            />
          </div>
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
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-gray-900">
                {pageTitle}
              </h2>

              {isPro && (
                <span className="rounded-full bg-[#EEF0FF] text-[#3730A3] text-xs font-medium px-3 py-1">
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
};

export default DashboardLayout;

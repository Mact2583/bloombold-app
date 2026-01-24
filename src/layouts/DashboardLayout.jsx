import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Tooltip from "@/components/Tooltip";

export default function DashboardLayout() {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();

  const lockedItem = (label) => (
    <Tooltip label="Coming soon — included with Pro">
      <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
        <span>{label}</span>
        <span className="text-xs">🔒</span>
      </div>
    </Tooltip>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white px-4 py-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#7D77DF]">
            BloomBold
          </h1>
          <p className="text-xs text-gray-500">
            Clarity, not templates.
          </p>
        </div>

        {/* CORE */}
        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive
                  ? "bg-[#F2F1FF] text-[#4B46C6]"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/resume-reviews"
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${
                isActive
                  ? "bg-[#F2F1FF] text-[#4B46C6]"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Resume Reviews
          </NavLink>
        </nav>

        {/* TOOLS */}
        <div className="mt-6">
          <p className="px-3 text-xs font-medium text-gray-400 uppercase mb-2">
            Tools
          </p>

          <div className="space-y-1">
            {isPro ? (
              <>
                <NavLink
                  to="/dashboard/resume-builder"
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Resume Builder
                </NavLink>
                <NavLink
                  to="/dashboard/interview-prep"
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Interview Prep
                </NavLink>
                <NavLink
                  to="/dashboard/career-journal"
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Career Journal
                </NavLink>
                <NavLink
                  to="/dashboard/ai-mentor"
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  AI Career Mentor
                </NavLink>
              </>
            ) : (
              <>
                {lockedItem("Resume Builder")}
                {lockedItem("Interview Prep")}
                {lockedItem("Career Journal")}
                {lockedItem("AI Career Mentor")}
              </>
            )}
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="mt-auto pt-6">
          <p className="px-3 text-xs font-medium text-gray-400 uppercase mb-2">
            Account
          </p>

          <NavLink
            to="/dashboard/profile"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </NavLink>

          <NavLink
            to="/dashboard/billing"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Billing
          </NavLink>

          {!isPro && (
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="mt-4 w-full rounded-md bg-[#7D77DF] px-4 py-2 text-sm font-medium text-white hover:bg-[#6A64D8]"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

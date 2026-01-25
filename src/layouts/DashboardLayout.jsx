import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const BRAND_PRIMARY =
  "bg-[#5B5BEA] hover:bg-[#4F4FD8] text-white";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {/* ================= Sidebar ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white z-40 flex flex-col">
        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-[#5B5BEA]">
              BloomBold
            </h1>
            <p className="text-xs text-muted-foreground">
              Clarity, not templates.
            </p>
          </div>

          <nav className="px-4 space-y-1 text-sm pb-20">
            <NavItem label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem
              label="Resume Reviews"
              onClick={() => navigate("/dashboard/reviews")}
            />

            <div className="pt-4 text-xs text-muted-foreground uppercase">
              Tools
            </div>

            {profile?.is_pro ? (
              <>
                <NavItem label="Resume Builder" onClick={() => navigate("/dashboard/builder")} />
                <NavItem label="Interview Prep" onClick={() => navigate("/dashboard/interview")} />
                <NavItem label="Career Journal" onClick={() => navigate("/dashboard/journal")} />
                <NavItem label="AI Career Mentor" onClick={() => navigate("/dashboard/mentor")} />
              </>
            ) : (
              <>
                <LockedItem label="Resume Builder" />
                <LockedItem label="Interview Prep" />
                <LockedItem label="Career Journal" />
                <LockedItem label="AI Career Mentor" />
              </>
            )}
          </nav>
        </div>

        {/* 🔒 PINNED ACCOUNT ACTIONS */}
        <div className="border-t p-4 bg-white">
          <NavItem label="Profile" onClick={() => navigate("/dashboard/profile")} />
          <NavItem label="Settings" onClick={() => navigate("/dashboard/settings")} />
          <NavItem label="Billing" onClick={() => navigate("/dashboard/billing")} />

          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:underline pt-2"
          >
            Log out
          </button>

          {!profile?.is_pro && (
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className={`w-full mt-3 rounded-md py-2 text-sm font-medium transition ${BRAND_PRIMARY}`}
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </>
  );
}

/* ================= Helpers ================= */

function NavItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-2 py-2 rounded hover:bg-gray-100"
    >
      {label}
    </button>
  );
}

function LockedItem({ label }) {
  return (
    <div className="flex items-center justify-between px-2 py-2 text-muted-foreground">
      <span>{label}</span>
      <span className="text-xs">🔒</span>
    </div>
  );
}

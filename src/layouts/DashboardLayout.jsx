import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const BRAND_PRIMARY =
  "bg-[#5B5BEA] hover:bg-[#4F4FD8] text-white";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Wait for auth to resolve
  if (loading) return null;

  // Protect dashboard routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 border-r bg-white flex flex-col">
        {/* ----- Top section ----- */}
        <div>
          <div className="p-6">
            <h1 className="text-xl font-semibold text-[#5B5BEA]">
              BloomBold
            </h1>
            <p className="text-xs text-muted-foreground">
              Clarity, not templates.
            </p>
          </div>

          <nav className="px-4 space-y-1 text-sm">
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

        {/* ----- Account section (ALWAYS visible) ----- */}
        <div className="mt-auto p-4 border-t space-y-2">
          <NavItem label="Profile" onClick={() => navigate("/dashboard/profile")} />
          <NavItem label="Settings" onClick={() => navigate("/dashboard/settings")} />
          <NavItem label="Billing" onClick={() => navigate("/dashboard/billing")} />

          {/* 🔒 LOG OUT — guaranteed visible */}
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:underline mt-2"
          >
            Log out
          </button>

          {/* Upgrade CTA — last */}
          {!profile?.is_pro && (
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className={`w-full mt-4 rounded-md py-2 text-sm font-medium transition ${BRAND_PRIMARY}`}
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
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

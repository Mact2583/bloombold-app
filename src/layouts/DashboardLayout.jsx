import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // 🔒 Don’t render until auth is resolved
  if (loading) return null;

  // 🔒 Safety: sidebar only exists for logged-in users
  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-full border-r bg-white flex flex-col justify-between">
      {/* ===== Top nav ===== */}
      <div>
        <div className="p-6">
          <h1 className="text-xl font-semibold text-indigo-600">BloomBold</h1>
          <p className="text-xs text-muted-foreground">
            Clarity, not templates.
          </p>
        </div>

        <nav className="px-4 space-y-1 text-sm">
          <NavItem label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem label="Resume Reviews" onClick={() => navigate("/dashboard/reviews")} />

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

      {/* ===== Account section ===== */}
      <div className="p-4 border-t space-y-2">
        <NavItem label="Profile" onClick={() => navigate("/dashboard/profile")} />
        <NavItem label="Settings" onClick={() => navigate("/dashboard/settings")} />
        <NavItem label="Billing" onClick={() => navigate("/dashboard/billing")} />

        {/* ✅ Logout is AUTH-ONLY (always visible when logged in) */}
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-red-600 hover:underline pt-2"
        >
          Log out
        </button>

        {/* ✅ Upgrade CTA is SUBSCRIPTION-ONLY */}
        {!profile?.is_pro && (
          <button
            onClick={() => navigate("/dashboard/upgrade")}
            className="w-full mt-3 rounded-md bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </aside>
  );
}

/* =============================
   Helpers
============================= */

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

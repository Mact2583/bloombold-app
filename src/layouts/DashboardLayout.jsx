import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { supabase } from "../lib/supabaseClient";

export default function DashboardLayout() {
  const { user } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">BloomBold</h2>

        <nav className="space-y-4">
          <Link to="/dashboard" className="block text-lg hover:text-blue-600">
            Overview
          </Link>
          <Link to="/dashboard/career" className="block text-lg hover:text-blue-600">
            Career Builder
          </Link>
          <Link to="/dashboard/mentor" className="block text-lg hover:text-blue-600">
            Mentor Chat
          </Link>
          <Link to="/dashboard/tools" className="block text-lg hover:text-blue-600">
            Tools
          </Link>
          <Link to="/dashboard/profile" className="block text-lg hover:text-blue-600">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">

        {/* Header with user + logout */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="bg-white shadow px-4 py-2 rounded-lg flex items-center gap-4">
            <span className="text-slate-600">{user?.email}</span>

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Render the page content */}
        <Outlet />
      </div>
    </div>
  );
}


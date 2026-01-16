import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

/**
 * Dashboard-level loading skeleton.
 * Mirrors the app shell so there is no auth flash.
 */
function AppShellSkeleton() {
  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-64 flex-col gap-4 p-4 border-r bg-background">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="space-y-2 mt-6">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>
        <div className="mt-auto h-10 w-full rounded bg-muted animate-pulse" />
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 p-6 space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 rounded-lg bg-muted animate-pulse" />
          <div className="h-40 rounded-lg bg-muted animate-pulse" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      </main>
    </div>
  );
}

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, loading: authLoading, profileLoading } = useAuth();

  // ⏳ Auth + profile resolving → render app shell skeleton
  if (authLoading || profileLoading) {
    return <AppShellSkeleton />;
  }

  // 🔐 Not authenticated → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: location.pathname }}
      />
    );
  }

  // ✅ Authenticated → render protected content
  return <Outlet />;
}


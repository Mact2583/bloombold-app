import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Billing() {
  const { user, isPro, loading: authLoading, profileLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⏳ Still resolving auth or profile → show neutral state
  if (authLoading || profileLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-gray-600">
            Loading your subscription details…
          </p>
        </header>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-200 rounded" />
            <div className="h-9 w-40 bg-gray-200 rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  // 📊 EVENT — billing page viewed (after truth is known)
  console.info("[event]", {
    name: "billing_viewed",
    source: "dashboard_billing",
    user: user?.id,
  });

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    // 📊 EVENT — billing portal opened
    console.info("[event]", {
      name: "billing_portal_opened",
      source: "dashboard_billing",
      user: user?.id,
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session"
      );

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No billing portal URL returned");
      }
    } catch (err) {
      console.error("Billing portal error:", err);
      setError(
        "We couldn’t open the billing portal. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-gray-600">
          Manage your subscription and billing details.
        </p>
      </header>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current plan</p>
            <p className="text-sm text-gray-600">
              {isPro ? "Pro" : "Free"}
            </p>
          </div>

          {isPro && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
              Pro
            </span>
          )}
        </div>

        <div className="mt-6">
          {isPro ? (
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="rounded-md bg-black px-6 py-3 text-white text-sm hover:bg-gray-900 disabled:opacity-50"
            >
              {loading
                ? "Opening billing portal…"
                : "Manage subscription"}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              You’re currently on the free plan.
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

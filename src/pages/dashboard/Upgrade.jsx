import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Upgrade() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 🔒 HARD GUARD
   * If prod user ever lands on localhost, force correct domain.
   */
  useEffect(() => {
    if (
      import.meta.env.PROD &&
      window.location.hostname === "localhost"
    ) {
      window.location.replace(
        "https://bloombold.io/dashboard/upgrade"
      );
    }
  }, []);

  /**
   * Handle Stripe checkout
   */
  const startCheckout = async (plan) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error("Checkout failed");
      }

      /**
       * 🔑 CRITICAL:
       * replace() removes this page from history
       * so back button NEVER returns here or to localhost
       */
      window.location.replace(data.url);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        "We couldn’t start checkout right now. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="text-gray-600 mt-2">
          For ongoing resume refinement and long-term career planning.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Unlimited resume reviews</li>
          <li>Full review history</li>
          <li>PDF exports</li>
          <li>All future tools included</li>
        </ul>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            disabled={loading}
            onClick={() => startCheckout("monthly")}
            className="w-full rounded-md bg-[#7D77DF] px-4 py-3 text-white font-medium hover:bg-[#6A64D8] disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Upgrade Monthly"}
          </button>

          <button
            disabled={loading}
            onClick={() => startCheckout("annual")}
            className="w-full rounded-md border px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Upgrade Annual (save)
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-2">
          Secure checkout · Cancel anytime
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Upgrade() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const startCheckout = async (plan) => {
    try {
      setError(null);
      setLoadingPlan(plan);

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: { plan },
        }
      );

      if (error || !data?.url) {
        throw new Error("Checkout session failed");
      }

      /**
       * 🔒 CRITICAL: HARD REDIRECT ONLY
       * No router navigation
       * No history
       * No fallbacks
       */
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError("We couldn’t start checkout right now. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold mb-2">BloomBold Pro</h1>
      <p className="text-muted-foreground mb-6">
        For ongoing resume refinement and long-term career planning.
      </p>

      <div className="border rounded-lg p-6 space-y-4 bg-white">
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>Unlimited resume reviews</li>
          <li>Full review history</li>
          <li>PDF exports</li>
          <li>All future tools included</li>
        </ul>

        {error && (
          <div className="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={() => startCheckout("monthly")}
          disabled={loadingPlan !== null}
          className="w-full rounded-md bg-indigo-600 text-white py-3 font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loadingPlan === "monthly"
            ? "Redirecting to Stripe…"
            : "Upgrade Monthly"}
        </button>

        <button
          onClick={() => startCheckout("annual")}
          disabled={loadingPlan !== null}
          className="w-full rounded-md border py-3 font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {loadingPlan === "annual"
            ? "Redirecting to Stripe…"
            : "Upgrade Annual (save)"}
        </button>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Secure checkout · Cancel anytime
        </p>
      </div>
    </div>
  );
}

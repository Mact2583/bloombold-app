import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Upgrade() {
  const navigate = useNavigate();
  const { user, isPro, loading } = useAuth();
  const [startingCheckout, setStartingCheckout] = useState(null);

  if (loading) return null;

  if (!user) {
    navigate("/login", {
      replace: true,
      state: { returnTo: "/dashboard/upgrade" },
    });
    return null;
  }

  if (isPro) {
    navigate("/dashboard/billing", { replace: true });
    return null;
  }

  const startCheckout = async (plan) => {
    try {
      setStartingCheckout(plan);

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            plan, // "monthly" or "annual"
            successUrl: `${window.location.origin}/dashboard?upgraded=true`,
            cancelUrl: `${window.location.origin}/dashboard/upgrade`,
          },
        }
      );

      if (error || !data?.url) {
        alert("We couldn’t start checkout right now. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      alert("Something went wrong starting checkout. Please try again.");
    } finally {
      setStartingCheckout(null);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="text-gray-600 mt-2">
          For ongoing resume refinement and long-term career planning.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Unlimited resume reviews</li>
          <li>Full review history</li>
          <li>PDF exports</li>
          <li>All future tools included</li>
        </ul>

        <div className="space-y-3">
          {/* Monthly */}
          <button
            onClick={() => startCheckout("monthly")}
            disabled={startingCheckout !== null}
            className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8] disabled:opacity-50"
          >
            {startingCheckout === "monthly"
              ? "Starting checkout…"
              : "$9 / month — Upgrade to Pro"}
          </button>

          {/* Annual */}
          <button
            onClick={() => startCheckout("annual")}
            disabled={startingCheckout !== null}
            className="w-full rounded-md border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {startingCheckout === "annual"
              ? "Starting checkout…"
              : "$79 / year — Best value"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Secure checkout via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

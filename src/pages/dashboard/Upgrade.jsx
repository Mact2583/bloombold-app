import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Upgrade() {
  const navigate = useNavigate();
  const { user, isPro } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (price) => {
    if (!user) {
      navigate("/login", {
        state: { returnTo: "/dashboard/upgrade" },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            price, // "monthly" | "annual"
            returnUrl: `${window.location.origin}/dashboard`,
          },
        }
      );

      if (error || !data?.url) {
        throw new Error("Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        "We couldn’t start checkout right now. Please try again in a moment."
      );
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            returnUrl: `${window.location.origin}/dashboard`,
          },
        }
      );

      if (error || !data?.url) {
        throw new Error("Unable to open billing portal");
      }

      window.location.href = data.url;
    } catch {
      setError(
        "We couldn’t open billing right now. Please try again in a moment."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="mt-2 text-gray-600">
          For ongoing resume refinement and long-term career clarity.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-lg border bg-white p-8 shadow-sm space-y-6">
        <ul className="space-y-2 text-gray-700">
          <li>• Unlimited resume reviews</li>
          <li>• Full review history</li>
          <li>• PDF exports</li>
          <li>• All future tools included</li>
        </ul>

        {/* PRO SUCCESS STATE */}
        {isPro && (
          <div className="rounded-md bg-green-50 border border-green-200 p-4 space-y-3">
            <p className="font-medium text-green-800">
              You’re Pro 🎉
            </p>
            <p className="text-sm text-green-700">
              Your subscription is active and all features are unlocked.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Manage billing
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}

        {/* CHECKOUT (ALWAYS AVAILABLE — DEFENSIVE UX) */}
        {!isPro && (
          <div className="space-y-4">
            <button
              onClick={() => handleCheckout("monthly")}
              disabled={loading}
              className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8] disabled:opacity-50"
            >
              Upgrade to Pro — $9 / month
            </button>

            <button
              onClick={() => handleCheckout("annual")}
              disabled={loading}
              className="w-full rounded-md border px-6 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Upgrade — $79 / year (Best value)
            </button>

            <p className="text-xs text-gray-500 text-center">
              Secure checkout via Stripe. Cancel anytime.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

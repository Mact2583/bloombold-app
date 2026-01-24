import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Upgrade() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // ✅ Handle Stripe success return ONCE
  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // Stripe succeeded → refresh profile + clean URL
      (async () => {
        await refreshProfile();

        // Remove Stripe params from URL so Back works normally
        navigate("/dashboard", { replace: true });
      })();
    }
  }, [searchParams, refreshProfile, navigate]);

  const startCheckout = async (billingPeriod) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: { billingPeriod }, // "monthly" | "annual"
        }
      );

      if (error || !data?.url) {
        throw new Error("Checkout failed");
      }

      // 🚀 Full redirect — do NOT use navigate()
      window.location.href = data.url;
    } catch (err) {
      alert("We couldn’t start checkout right now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">BloomBold Pro</h1>
        <p className="text-gray-600 mt-2">
          For ongoing resume refinement and long-term career planning.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Unlimited resume reviews</li>
          <li>Full review history</li>
          <li>PDF exports</li>
          <li>All future tools included</li>
        </ul>

        <div className="space-y-3 pt-4">
          <button
            disabled={loading}
            onClick={() => startCheckout("monthly")}
            className="w-full rounded-md bg-[#7D77DF] px-4 py-3 text-white font-medium hover:bg-[#6A64D8] disabled:opacity-50"
          >
            Upgrade Monthly
          </button>

          <button
            disabled={loading}
            onClick={() => startCheckout("annual")}
            className="w-full rounded-md border px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Upgrade Annual (save)
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center pt-2">
          Secure checkout · Cancel anytime
        </p>
      </div>
    </div>
  );
}

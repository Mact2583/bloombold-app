import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Upgrade() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const startCheckout = async (plan = "monthly") => {
    if (!user || loading) return;

    setLoading(true);

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "create-checkout-session",
          {
            body: { plan },
          }
        );

      if (error || !data?.url) {
        alert(
          "We couldn’t start checkout right now. Please try again."
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      alert(
        "Something went wrong starting checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Upgrade
        </h1>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            BloomBold Pro
          </h2>
          <p className="text-gray-600 mt-1">
            For ongoing resume refinement and long-term
            career planning.
          </p>
        </div>

        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Unlimited resume reviews</li>
          <li>Full review history</li>
          <li>PDF exports</li>
          <li>All future tools included</li>
        </ul>

        <button
          onClick={() => startCheckout("monthly")}
          disabled={loading}
          className="w-full rounded-md bg-[#7D77DF] py-3 text-white font-medium hover:bg-[#6A64D8] disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Upgrade to Pro"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Secure checkout. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

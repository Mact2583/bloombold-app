import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";

function UpgradeSkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-12 w-full rounded bg-muted mt-4" />
      </div>
    </div>
  );
}

export default function Upgrade() {
  const navigate = useNavigate();
  const { user, isPro, loading: authLoading } = useAuth();

  // 🚪 If user becomes Pro, send them to Billing
  useEffect(() => {
    if (!authLoading && isPro) {
      navigate("/dashboard/billing", { replace: true });
    }
  }, [authLoading, isPro, navigate]);

  // 🔐 Auth resolving
  if (authLoading) {
    return <UpgradeSkeleton />;
  }

  // 🔐 Not logged in → go to login with return path
  if (!user) {
    navigate("/login", {
      replace: true,
      state: { returnTo: "/dashboard/upgrade" },
    });
    return null;
  }

  // 🚀 Stripe checkout
  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            returnUrl:
              window.location.origin + "/dashboard/billing",
          },
        }
      );

      if (error || !data?.url) {
        alert(
          "We couldn’t start checkout right now. Please try again in a moment."
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      alert(
        "Something went wrong starting checkout. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="text-gray-600 mt-2">
          For ongoing resume refinement and long-term career planning.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <p className="text-sm text-gray-700">
          Pro is designed for people who want to iterate,
          revisit feedback, and keep a record of their progress.
        </p>

        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Unlimited AI resume reviews</li>
          <li>• Full access to your review history</li>
          <li>• PDF exports for saving or sharing</li>
          <li>• Ongoing improvements as features evolve</li>
        </ul>

        <button
          onClick={handleUpgrade}
          className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8]"
        >
          Upgrade to Pro
        </button>

        <p className="text-xs text-gray-500 text-center">
          Secure checkout via Stripe. Cancel anytime from billing.
        </p>
      </div>

      {/* Back */}
      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm underline text-gray-600"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}

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

  // If user becomes Pro, redirect back to dashboard
  useEffect(() => {
    if (!authLoading && isPro) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isPro, navigate]);

  if (authLoading) {
    return <UpgradeSkeleton />;
  }

  if (!user) {
    navigate("/login", {
      replace: true,
      state: { returnTo: "/dashboard/upgrade" },
    });
    return null;
  }

  const startCheckout = async (billingCycle) => {
    try {
      // 🔐 Explicitly fetch session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("No active session");
      }

      // 🚀 Invoke Edge Function WITH auth header
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ billingCycle }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout failed");
      }

      const data = await res.json();

      if (!data?.url) {
        throw new Error("Missing Stripe checkout URL");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("We couldn’t start checkout right now. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="text-gray-600 mt-2">
          Unlimited resume reviews, full history, and exports.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Unlimited AI resume reviews</li>
          <li>• Full access to review history</li>
          <li>• PDF exports</li>
          <li>• Ongoing feature improvements</li>
        </ul>

        <button
          onClick={() => startCheckout("monthly")}
          className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8]"
        >
          $9 / month — Upgrade to Pro
        </button>

        <button
          onClick={() => startCheckout("annual")}
          className="w-full rounded-md border px-6 py-3 font-medium"
        >
          $79 / year — Best value
        </button>

        <p className="text-xs text-gray-500 text-center">
          Secure checkout via Stripe. Cancel anytime.
        </p>
      </div>

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

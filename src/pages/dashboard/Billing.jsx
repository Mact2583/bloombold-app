import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

function BillingSkeleton() {
  return (
    <div className="max-w-3xl space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
        <div className="h-12 w-48 rounded bg-muted mt-4" />
      </div>
    </div>
  );
}

export default function Billing() {
  const navigate = useNavigate();
  const { user, isPro, loading: authLoading } = useAuth();
  const [openingPortal, setOpeningPortal] = useState(false);

  if (authLoading) {
    return <BillingSkeleton />;
  }

  if (!user) {
    navigate("/login", {
      replace: true,
      state: { returnTo: "/dashboard/billing" },
    });
    return null;
  }

  const handleManageBilling = async () => {
    try {
      setOpeningPortal(true);

      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            returnUrl:
              window.location.origin + "/dashboard/billing",
          },
        }
      );

      if (error || !data?.url) {
        alert(
          "We couldn’t open billing right now. Please try again in a moment."
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      alert(
        "Something went wrong opening billing. Please try again."
      );
    } finally {
      setOpeningPortal(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Billing
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your BloomBold subscription.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Current plan
        </h2>

        {!isPro && (
          <>
            <p className="text-gray-700">
              You’re currently on the Free plan.
            </p>

            <p className="text-sm text-gray-600">
              Free accounts include up to 3 resume reviews.
              Only your most recent review is saved.
            </p>

            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="mt-4 rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8]"
            >
              Upgrade to Pro
            </button>

            {/* Reassurance */}
            <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
              <p>
                • Cancel anytime — no long-term commitment
              </p>
              <p>
                • Secure checkout and billing managed by Stripe
              </p>
              <p>
                • Keep access through the end of your billing period if you cancel
              </p>
            </div>
          </>
        )}

        {isPro && (
          <>
            <p className="text-gray-700">
              You’re on the BloomBold Pro plan.
            </p>

            <p className="text-sm text-gray-600">
              Unlimited resume reviews, full history access,
              and PDF exports are enabled.
            </p>

            <button
              onClick={handleManageBilling}
              disabled={openingPortal}
              className="mt-4 rounded-md border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {openingPortal
                ? "Opening billing…"
                : "Manage subscription"}
            </button>

            {/* Reassurance */}
            <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
              <p>
                Billing is handled securely through Stripe.
              </p>
              <p>
                You can update payment methods, download invoices,
                or cancel your subscription at any time.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

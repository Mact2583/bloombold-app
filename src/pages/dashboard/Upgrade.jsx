import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";

function UpgradeSkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-6 animate-pulse">
      <div className="h-7 w-48 rounded bg-muted" />
      <div className="h-4 w-72 rounded bg-muted" />
      <div className="h-32 rounded bg-muted" />
    </div>
  );
}

export default function Upgrade() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isPro, loading: authLoading } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);

  // 🎉 Pro success moment
  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setShowSuccess(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 🚪 If user becomes Pro, stay on page briefly (don’t auto-redirect)
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

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session"
      );

      if (error || !data?.url) {
        alert("We couldn’t start checkout right now.");
        return;
      }

      window.location.href = data.url;
    } catch {
      alert("Something went wrong starting checkout.");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {showSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <h2 className="text-lg font-semibold text-green-800">
            You’re Pro 🎉
          </h2>
          <p className="mt-1 text-sm text-green-700">
            Your BloomBold Pro features are now unlocked.
            You can revisit past reviews, run unlimited analyses,
            and export PDFs anytime.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>
        <p className="text-gray-600 mt-2">
          For ongoing resume refinement and long-term career planning.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        {!isPro && (
          <>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Unlimited resume reviews</li>
              <li>• Full review history</li>
              <li>• PDF exports</li>
              <li>• All future tools included</li>
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8]"
            >
              Upgrade to Pro
            </button>

            <p className="text-xs text-gray-500 text-center">
              Secure checkout. Cancel anytime.
            </p>
          </>
        )}

        {isPro && (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-md border px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Go to dashboard
          </button>
        )}
      </div>
    </div>
  );
}

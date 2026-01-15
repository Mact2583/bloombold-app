import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    isPro,
    loading: authLoading,
    profileLoading,
  } = useAuth();

  const [latestReview, setLatestReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  /**
   * ⏳ HARD STOP
   * Do NOT render dashboard content until auth + profile are resolved
   * This removes the “slow login / hanging” feeling
   */
  if (authLoading || profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">
            Loading your account…
          </p>
        </header>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  /**
   * 🔐 Not logged in → redirect once (no loops)
   */
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
        state: { returnTo: "/dashboard" },
      });
    }
  }, [user, navigate]);

  /**
   * 📦 Load latest resume review (safe, after auth)
   */
  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadLatestReview = async () => {
      setLoadingReviews(true);

      const { data } = await supabase
        .from("resume_reviews")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!active) return;

      setLatestReview(data?.[0] ?? null);
      setLoadingReviews(false);
    };

    loadLatestReview();

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Continue improving your resume with BloomBold.
        </p>
      </header>

      {/* Resume Reviews Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">
          Resume Reviews
        </h2>

        <p className="text-sm text-gray-600">
          {isPro
            ? "View your past reviews or run a new one."
            : "Free accounts can view their most recent resume review."}
        </p>

        {/* Latest Review */}
        {!loadingReviews && latestReview && (
          <div className="flex items-center justify-between rounded-md border p-4">
            <span className="text-sm text-gray-700">
              Last review:{" "}
              {new Date(
                latestReview.created_at
              ).toLocaleDateString()}
            </span>

            <button
              onClick={() =>
                navigate(
                  `/dashboard/resume-reviews/${latestReview.id}`
                )
              }
              className="text-sm font-medium underline"
            >
              View review
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingReviews && !latestReview && (
          <p className="text-sm text-gray-600">
            Your resume reviews will appear here once you run
            your first analysis.
          </p>
        )}

        {/* Primary CTA */}
        <div className="pt-4 flex gap-4">
          <button
            onClick={() => navigate("/resume-review")}
            className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900"
          >
            Run another resume review
          </button>

          {!isPro && (
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="text-sm underline"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

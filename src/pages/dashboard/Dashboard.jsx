import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isPro, loading: authLoading } = useAuth();

  const [latestReview, setLatestReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadLatestReview = async () => {
      // Only show loading the first time
      setLoading((prev) => (prev ? true : false));

      const { data, error } = await supabase
        .from("resume_reviews")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Failed to load latest review:", error);
        setLatestReview(null);
      } else {
        setLatestReview(data || null);
      }

      setLoading(false);
    };

    loadLatestReview();

    return () => {
      active = false;
    };
  }, [user]);

  /* ──────────────────────────────
     AUTH GATE ONLY (no data blocking)
     ────────────────────────────── */
  if (authLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-gray-600">
          Here’s where your resume progress lives.
        </p>
      </div>

      {/* Resume Reviews Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Resume Reviews</h2>

          {!isPro && (
            <p className="text-sm text-gray-500">
              Free accounts include up to 3 resume reviews.
            </p>
          )}
        </div>

        {/* Loading state (DATA ONLY) */}
        {loading && (
          <p className="text-sm text-gray-500">
            Loading your latest review…
          </p>
        )}

        {/* No reviews yet */}
        {!loading && !latestReview && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Start with your first resume review — it’s free.
            </p>

            <button
              onClick={() => navigate("/resume-review")}
              className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900"
            >
              Run your first resume review
            </button>
          </div>
        )}

        {/* Has at least one review */}
        {!loading && latestReview && (
          <div className="space-y-4">
            <p className="text-gray-600">Most recent review:</p>

            <div className="flex items-center justify-between rounded border p-4">
              <span className="text-sm text-gray-700">
                {new Date(latestReview.created_at).toLocaleString()}
              </span>

              <button
                onClick={() =>
                  navigate(`/dashboard/resume-reviews/${latestReview.id}`)
                }
                className="text-sm font-medium underline"
              >
                View review
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Want feedback on another version or role?
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/resume-review")}
                className="rounded-md border px-5 py-2 text-sm"
              >
                Run another review
              </button>

              {!isPro && (
                <button
                  onClick={() => navigate("/dashboard/upgrade")}
                  className="rounded-md bg-black px-5 py-2 text-sm text-white hover:bg-gray-900"
                >
                  Upgrade to Pro
                </button>
              )}

              {isPro && (
                <button
                  onClick={() => navigate("/dashboard/resume-reviews")}
                  className="rounded-md border px-5 py-2 text-sm"
                >
                  View full history
                </button>
              )}
            </div>

            {!isPro && (
              <p className="text-sm text-gray-500">
                Upgrade to Pro to revisit past reviews and run unlimited analyses.
              </p>
            )}

            {isPro && (
              <p className="text-sm text-green-700">
                Pro — unlimited resume reviews enabled.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

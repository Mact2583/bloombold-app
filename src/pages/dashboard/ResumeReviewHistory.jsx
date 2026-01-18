import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

function ReviewListSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border bg-background p-6 space-y-4"
        >
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
          <div className="h-10 w-40 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function ResumeReviewHistory() {
  const navigate = useNavigate();
  const { user, isPro, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadReviews = async () => {
      // Only show loading the first time
      setLoading((prev) => (prev ? true : false));

      let query = supabase
        .from("resume_reviews")
        .select("id, created_at, results")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Free users only receive most recent review
      if (!isPro) {
        query = query.limit(1);
      }

      const { data, error } = await query;

      if (!active) return;

      if (error) {
        console.error("Failed to load resume reviews:", error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, [user, isPro]);

  /* ──────────────────────────────
     AUTH GATE ONLY
     ────────────────────────────── */
  if (authLoading) {
    return <ReviewListSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Resume Reviews</h1>

        {!isPro && (
          <p className="text-sm text-gray-600 mt-1">
            Your most recent resume review is saved here.
          </p>
        )}
      </div>

      {/* Data loading */}
      {loading && <ReviewListSkeleton />}

      {/* Empty state */}
      {!loading && reviews.length === 0 && (
        <p className="text-gray-600">
          Your resume reviews will appear here once you run your first analysis.
        </p>
      )}

      {/* Reviews */}
      {!loading &&
        reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border bg-background p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500 mb-3">
              {new Date(review.created_at).toLocaleString()}
            </p>

            <div className="space-y-3 leading-relaxed">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Overall impression
                </p>
                <p className="text-gray-800">
                  {review.results?.overall_impression || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Interview readiness
                </p>
                <p className="text-gray-800">
                  {review.results?.interview_readiness || "—"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  navigate(`/dashboard/resume-reviews/${review.id}`)
                }
                className="rounded-md border px-5 py-2 text-sm"
              >
                View review
              </button>

              {!isPro && (
                <button
                  onClick={() => navigate("/dashboard/upgrade")}
                  className="rounded-md bg-black px-5 py-2 text-white text-sm hover:bg-gray-900"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        ))}

      {/* Free-tier explanation */}
      {!isPro && !loading && reviews.length > 0 && (
        <p className="text-sm text-gray-500">
          Upgrade to Pro to view your full review history and export PDFs.
        </p>
      )}
    </div>
  );
}

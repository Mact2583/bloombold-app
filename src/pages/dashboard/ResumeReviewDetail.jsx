import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

function ReviewLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-6 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-1/2" />

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}

export default function ResumeReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isPro, loading: authLoading } = useAuth();

  const [review, setReview] = useState(null);
  const [isMostRecent, setIsMostRecent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadReview = async () => {
      setLoading(true);

      // Load requested review
      const { data: reviewData } = await supabase
        .from("resume_reviews")
        .select("id, created_at, target_role, results")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!active) return;

      // Load most recent review ID
      const { data: latest } = await supabase
        .from("resume_reviews")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!active) return;

      setReview(reviewData || null);
      setIsMostRecent(
        Boolean(reviewData && latest && reviewData.id === latest.id)
      );
      setLoading(false);
    };

    loadReview();

    return () => {
      active = false;
    };
  }, [id, user]);

  // 🔐 Auth resolving
  if (authLoading || loading) {
    return <ReviewLoadingSkeleton />;
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Free user accessing older review
  if (!isPro && !isMostRecent) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold">
          Review unavailable
        </h1>

        <p className="text-gray-600">
          Free accounts can view their most recent resume review.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate("/dashboard/resume-reviews")
            }
            className="rounded-md border px-5 py-2 text-sm"
          >
            View latest review
          </button>

          <button
            onClick={() =>
              navigate("/dashboard/upgrade")
            }
            className="rounded-md bg-black px-5 py-2 text-sm text-white hover:bg-gray-900"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  // 🚫 Review not found
  if (!review) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold">
          Review not found
        </h1>

        <p className="text-gray-600">
          This resume review may no longer be available.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md border px-5 py-2 text-sm"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          Resume Review
        </h1>

        <p className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleString()}
          {review.target_role && ` • ${review.target_role}`}
        </p>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {Object.entries(review.results || {}).map(
          ([section, content]) => (
            <div
              key={section}
              className="rounded-lg border bg-background p-6 shadow-sm space-y-2"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                {section.replace(/_/g, " ")}
              </h2>

              <p className="text-gray-800 whitespace-pre-line">
                {content}
              </p>
            </div>
          )
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          onClick={() => navigate("/resume-review")}
          className="rounded-md border px-5 py-2 text-sm"
        >
          Run another review
        </button>

        {isPro && (
          <button
            onClick={() =>
              navigate("/dashboard/resume-reviews")
            }
            className="rounded-md border px-5 py-2 text-sm"
          >
            View full history
          </button>
        )}
      </div>

      {!isPro && (
        <p className="text-sm text-gray-500">
          Your most recent review is saved here.
          Upgrade to revisit past feedback and export PDFs.
        </p>
      )}
    </div>
  );
}

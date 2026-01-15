import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReviewHistory() {
  const navigate = useNavigate();
  const { user, isPro } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadReviews = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("resume_reviews")
        .select("id, created_at, results")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // 🔒 Non-Pro users only get the most recent review
      if (!isPro) {
        query = query.limit(1);
      }

      const { data, error } = await query;

      if (!active) return;

      if (error) {
        setError("We couldn’t load your resume reviews.");
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

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading resume reviews…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Resume Reviews
        </h1>
        {!isPro && (
          <p className="text-sm text-gray-600 mt-1">
            Free accounts can view their most recent resume review.
          </p>
        )}
      </div>

      {/* Empty state */}
      {reviews.length === 0 && (
        <p className="text-gray-600">
          Your resume reviews will appear here once you run your first analysis.
        </p>
      )}

      {/* Reviews */}
      {reviews.map((review, index) => (
        <div
          key={review.id}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-gray-500 mb-3">
            {new Date(review.created_at).toLocaleString()}
          </p>

          <div className="space-y-3 leading-relaxed">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Overall Impression
              </p>
              <p className="text-gray-800">
                {review.results?.overall_impression || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Interview Readiness
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
              {isPro ? "View full review" : "View preview"}
            </button>

            {!isPro && (
              <button
                onClick={() => navigate("/dashboard/upgrade")}
                className="rounded-md bg-black px-5 py-2 text-white text-sm hover:bg-gray-900"
              >
                Unlock full history
              </button>
            )}
          </div>

          {/* Free-tier explanation */}
          {!isPro && index === 0 && (
            <p className="mt-4 text-xs text-gray-500">
              Upgrade to Pro to access all past resume reviews and export your feedback.
            </p>
          )}
        </div>
      ))}

      {/* Pro users: history hint */}
      {isPro && reviews.length > 1 && (
        <p className="text-xs text-gray-500">
          Showing all resume reviews.
        </p>
      )}
    </div>
  );
}

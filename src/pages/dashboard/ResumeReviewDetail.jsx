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
    if (authLoading || !user) return;

    let active = true;

    const loadReview = async () => {
      setLoading(true);

      const { data: reviewData, error: reviewError } = await supabase
        .from("resume_reviews")
        .select("id, created_at, target_role, results")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (reviewError) {
        console.error(reviewError);
        setLoading(false);
        return;
      }

      const { data: latest } = await supabase
        .from("resume_reviews")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setReview(reviewData);
      setIsMostRecent(Boolean(reviewData && latest && reviewData.id === latest.id));
      setLoading(false);
    };

    loadReview();
    return () => {
      active = false;
    };
  }, [id, user, authLoading]);

  /* ───── Guards ───── */

  if (authLoading || loading) {
    return <ReviewLoadingSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!review) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Review not found</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (!isPro && !isMostRecent) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">Review unavailable</h1>
        <button
          onClick={() => navigate("/dashboard/upgrade")}
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  // ✅ CRITICAL STABILITY GUARD
  if (!review.results || typeof review.results !== "object") {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Resume Review</h1>
        <p className="text-sm text-gray-500">
          Your review is being prepared. This usually takes under a minute.
        </p>
      </div>
    );
  }

  /* ───── Display config ───── */

  const sectionOrder = [
    "overall_impression",
    "strengths",
    "fix_first",
    "gaps",
    "ats_tips",
    "interview_readiness",
  ];

  const sectionLabels = {
    overall_impression: "Overall impression",
    strengths: "What’s working",
    fix_first: "Priority fixes",
    gaps: "Timeline & clarity",
    ats_tips: "ATS & formatting",
    interview_readiness: "Interview readiness",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Resume Review</h1>
        <p className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleString()}
        </p>
      </div>

      {sectionOrder.map((key) => (
        <div
          key={key}
          className={`rounded-lg border p-6 space-y-2 ${
            key === "fix_first"
              ? "bg-amber-50 border-amber-200"
              : "bg-background"
          }`}
        >
          <h2 className="text-sm font-semibold text-gray-700">
            {sectionLabels[key]}
          </h2>
          <p className="text-gray-800 whitespace-pre-line">
            {review.results[key]}
          </p>
        </div>
      ))}

      <button
        onClick={() => navigate("/resume-review")}
        className="rounded-md border px-4 py-2 text-sm"
      >
        Run another review
      </button>

      {!isPro && (
        <p className="text-sm text-gray-500">
          Your most recent review is saved here. Upgrade to revisit past feedback.
        </p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import ResumeReviewFormatted from "@/components/ResumeReviewFormatted";

export default function ResumeReviewDetail() {
  console.log("ResumeReviewDetail mounted");
  const { id } = useParams();
  const { user, isPro, loading: authLoading } = useAuth();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ DATA FETCH (hooks always run)
  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadReview = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("resume_reviews")
        .select("id, created_at, target_role, results")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        setError("We couldn’t load this resume review.");
        setReview(null);
      } else {
        setReview(data);
      }

      setLoading(false);
    };

    loadReview();

    return () => {
      active = false;
    };
  }, [id, user]);
  
  console.log("Auth state:", { user, isPro, authLoading });

  /* ──────────────────────────────
     RENDER STATES (NO HOOKS BELOW)
     ────────────────────────────── */

  // 1️⃣ Auth still resolving
  if (authLoading) {
    return (
      <div className="text-gray-500">
        Checking access…
      </div>
    );
  }

  // 2️⃣ Not logged in
  //if (!user) {
  //return <Navigate to="/login" replace />;
  //}

  // 3️⃣ Logged in but not Pro
  //if (!isPro) {
  //return <Navigate to="/dashboard/upgrade" replace />;
  //}

  // 4️⃣ Review loading
  if (loading) {
    return (
      <div className="text-gray-500">
        Loading review…
      </div>
    );
  }

  // 5️⃣ Error state
  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/dashboard/resume-reviews"
          className="text-sm underline"
        >
          Back to history
        </Link>
      </div>
    );
  }

  // 6️⃣ No data (edge case)
  if (!review || !review.results) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          This review doesn’t contain feedback yet.
        </p>
        <Link
          to="/dashboard/resume-reviews"
          className="text-sm underline mt-3 inline-block"
        >
          Back to history
        </Link>
      </div>
    );
  }

  // 7️⃣ SUCCESS 🎉
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Resume Review
        </h1>
        <p className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleString()}
          {review.target_role && ` • Target role: ${review.target_role}`}
        </p>
      </div>

      <ResumeReviewFormatted results={review.results} />

      <div className="flex gap-4 pt-4">
        <Link
          to={`/dashboard/resume-reviews/${review.id}/export`}
          className="rounded-md bg-black px-5 py-2 text-white text-sm hover:bg-gray-900"
        >
          Export Review
        </Link>

        <Link
          to="/dashboard/resume-reviews"
          className="rounded-md border px-5 py-2 text-sm"
        >
          Back to history
        </Link>
      </div>
    </div>
  );
}

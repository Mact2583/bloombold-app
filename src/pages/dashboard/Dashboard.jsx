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
      setLoading(true);

      const { data, error } = await supabase
        .from("resume_reviews")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      setLatestReview(error ? null : data || null);
      setLoading(false);
    };

    loadLatestReview();

    return () => {
      active = false;
    };
  }, [user]);

  if (authLoading) {
    return <LoadingSkeleton />;
  }

  const isFirstTime = !loading && !latestReview;

  return (
    <div className="max-w-4xl space-y-10">
      {/* Onboarding intro (first-time users only) */}
      {isFirstTime && (
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome to BloomBold
          </h2>

          <p className="text-gray-700">
            BloomBold helps you improve your resume with clear,
            ATS-aware feedback — and keeps your progress organized as you iterate.
          </p>

          <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
            <li>Run a resume review (free)</li>
            <li>Review actionable feedback</li>
            <li>Iterate and track progress over time</li>
          </ul>

          <p className="text-sm text-gray-500">
            You can upgrade anytime to unlock unlimited reviews,
            full history, and upcoming tools.
          </p>
        </div>
      )}

      {/* Status Card */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
        {!isPro ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">
              You’re on the Free plan
            </h2>
            <p className="text-gray-700">
              You can run up to 3 resume reviews.
              Your most recent review is saved here for reference.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900">
              BloomBold Pro is active
            </h2>
            <p className="text-gray-700">
              You have unlimited resume reviews,
              full history access, and all future tools included.
            </p>
          </>
        )}
      </div>

      {/* Resume Reviews */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Resume Reviews
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Your resume feedback lives here as you refine and improve.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">
            Loading your latest review…
          </p>
        )}

        {!loading && !latestReview && (
          <div className="space-y-4">
            <p className="text-gray-700">
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

        {!loading && latestReview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded border p-4">
              <span className="text-sm text-gray-700">
                Last review run on{" "}
                {new Date(latestReview.created_at).toLocaleDateString()}
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
                  className="rounded-md bg-[#7D77DF] px-5 py-2 text-sm text-white hover:bg-[#6A64D8]"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

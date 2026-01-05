import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";

import ResumeForm from "@/components/ResumeForm";
import ResumeResults from "@/components/ResumeResults";

const FREE_LIMIT = 3;

const ResumeReview = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  const [countLoading, setCountLoading] = useState(true);

  // Redirect unauthenticated users with return path
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/resume-review");
    }
  }, [loading, user, navigate]);

  // Fetch number of existing reviews
  useEffect(() => {
    const fetchReviewCount = async () => {
      if (!user) return;

      setCountLoading(true);

      const { count, error } = await supabase
        .from("resume_reviews")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!error) {
        setReviewCount(count ?? 0);
      }

      setCountLoading(false);
    };

    fetchReviewCount();
  }, [user]);

  if (loading || countLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const limitReached = reviewCount >= FREE_LIMIT;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">
            Get AI-Powered Resume Feedback
          </h1>
          <p className="text-muted-foreground">
            Clear, actionable suggestions to improve your resume.
          </p>
        </header>

        {/* Usage banner */}
        <div className="rounded-md border bg-muted p-4 text-sm text-center">
          You’ve used{" "}
          <strong>
            {reviewCount} / {FREE_LIMIT}
          </strong>{" "}
          free resume reviews.
        </div>

        {limitReached ? (
          <div className="rounded-lg border border-dashed p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">
              You’ve reached your free limit
            </h2>
            <p className="text-muted-foreground">
              Upgrade to continue analyzing resumes and track your progress
              over time.
            </p>

            <button
              onClick={() => navigate("/billing")}
              className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Upgrade to Continue
            </button>
          </div>
        ) : (
          <>
            <ResumeForm
              onAnalyze={(data) => {
                setResults(data);
                setReviewCount((prev) => prev + 1);
              }}
            />

            <ResumeResults results={results} />
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeReview;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabaseClient";

const ResumeReview = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [error, setError] = useState(null);

  const submitResume = async () => {
    setLoading(true);
    setError(null);
    setUpgradeRequired(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText }),
        }
      );

      const data = await res.json();

      if (data?.upgradeRequired) {
        setUpgradeRequired(true);
        return;
      }

      if (!data?.success) {
        throw new Error("Resume analysis failed.");
      }

      navigate(`/dashboard/resume-reviews/${data.reviewId}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 FREE LIMIT STATE
  if (upgradeRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-6 space-y-4 text-center">
          <h2 className="text-xl font-semibold">
            You’ve reached the free limit
          </h2>

          <p className="text-sm text-muted-foreground">
            You’ve used all 3 free resume reviews. You can still access your
            previous results from the dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/dashboard/upgrade")}>
              Unlock Pro
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              Back to dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ✍️ NORMAL INPUT STATE
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Resume Review</h1>

      <Textarea
        rows={12}
        placeholder="Paste your resume text here…"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button
        onClick={submitResume}
        disabled={loading || !resumeText.trim()}
      >
        {loading ? "Analyzing…" : "Analyze Resume"}
      </Button>
    </div>
  );
};

export default ResumeReview;

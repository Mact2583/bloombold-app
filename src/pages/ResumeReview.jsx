import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    if (!resumeText.trim()) {
      setError("Please paste your resume to continue.");
      return;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { returnTo: "/resume-review" },
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-resume",
        {
          body: { resumeText },
        }
      );

      if (error) {
        throw error;
      }

      if (data?.upgradeRequired) {
        navigate("/dashboard/upgrade", { replace: true });
        return;
      }

      if (data?.success && data?.reviewId) {
        navigate(`/dashboard/resume-reviews/${data.reviewId}`, {
          replace: true,
        });
        return;
      }

      throw new Error("Unexpected response from analysis service.");
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError(
        "We couldn’t analyze your resume right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Resume Review
        </h1>
        <p className="text-gray-600 mt-2">
          Get clear, ATS-aware feedback — focused on impact, not templates.
        </p>
      </div>

      {/* Resume input */}
      <div className="space-y-2">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={14}
          className="w-full rounded-md border p-4 text-sm"
          placeholder="Paste your resume text here…"
        />
        <p className="text-xs text-gray-500">
          No formatting required. Results usually appear in under a minute.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Action */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Get resume feedback"}
      </button>
    </div>
  );
}

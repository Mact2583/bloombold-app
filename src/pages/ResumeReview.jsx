import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

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

      {/* 🔍 Product clarity: How BloomBold is different */}
      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
            <span className="text-sm font-semibold">i</span>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900">
              How BloomBold is different
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">
                This isn’t a one-off AI response.
              </span>{" "}
              BloomBold is built for ongoing career work — not just quick edits.
            </p>

            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>Your feedback is saved so you can refine over time</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Reviews build on past context instead of starting from scratch
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                <span>
                  Guidance reflects hiring patterns, not just wording suggestions
                </span>
              </li>
            </ul>

            {/* 💸 Pro-aware note (hidden for Pro users) */}
            {!profile?.is_pro && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    If you decide to go Pro later:
                  </span>{" "}
                  you’ll unlock review history, version comparison, and exports —
                  so your improvements compound instead of resetting.
                </p>
              </div>
            )}

            <p className="mt-4 text-sm italic text-gray-600">
              Think of this as career infrastructure, not a prompt.
            </p>
          </div>
        </div>
      </section>

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

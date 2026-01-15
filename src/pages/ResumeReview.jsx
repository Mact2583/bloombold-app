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
    setLoading(true);

    // 📊 EVENT — resume submitted
    console.info("[event]", {
      name: "resume_review_submitted",
      source: "resume_review",
      user: user?.id ?? "anonymous",
    });

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

      // 🚧 Free limit reached
      if (data?.upgradeRequired) {
        console.info("[event]", {
          name: "resume_review_limit_reached",
          source: "resume_review",
          user: user?.id ?? "anonymous",
        });

        setError(
          "You’ve reached the free resume limit. Upgrade to Pro to continue reviewing resumes."
        );
        return;
      }

      // ✅ Success → dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        "We couldn’t analyze your resume right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    console.info("[event]", {
      name: "upgrade_clicked",
      source: "resume_review",
      user: user?.id ?? "anonymous",
    });

    if (user) {
      navigate("/dashboard/upgrade");
    } else {
      navigate("/login", {
        state: { returnTo: "/resume-review" },
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          AI Resume Review
        </h1>
        <p className="text-gray-600">
          Get clear, ATS-aware feedback on your resume.
        </p>
      </div>

      <div className="rounded-md border bg-blue-50 p-4 text-sm text-blue-900">
        <strong>Free accounts</strong> can review up to{" "}
        <strong>3 resumes</strong>.  
        Upgrade to Pro anytime for{" "}
        <strong>unlimited reviews</strong> and saved history.
      </div>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={12}
        className="w-full rounded-md border p-4 text-sm"
        placeholder="Paste your resume here…"
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Reviewing…" : "Review Resume"}
        </button>

        <button
          onClick={handleUpgradeClick}
          className="text-sm underline"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitHit, setLimitHit] = useState(false);
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/analyze-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText }),
        }
      );

      const data = await res.json();

      if (data.upgradeRequired) {
        setLimitHit(true);
        setUsed(data.used);
        setLimit(data.limit);
        return;
      }

      if (!data.success) {
        throw new Error("Analysis failed");
      }

      navigate(`/dashboard/resume-reviews/${data.reviewId}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🚧 FREE LIMIT STATE
  if (limitHit) {
    return (
      <div className="max-w-xl mx-auto mt-16 space-y-6 text-center">
        <h1 className="text-2xl font-semibold">
          You’ve reached the free review limit
        </h1>

        <p className="text-gray-600">
          Free accounts include up to {limit} resume reviews.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard/upgrade")}
            className="rounded-md bg-black px-6 py-3 text-white font-medium"
          >
            Upgrade to Pro
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-600 underline"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  // 📝 NORMAL FORM
  return (
    <div className="max-w-xl mx-auto mt-16 space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Resume Review
      </h1>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={10}
        className="w-full rounded-md border p-3"
        placeholder="Paste your resume text here..."
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !resumeText.trim()}
        className="w-full rounded-md bg-black px-6 py-3 text-white font-medium disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Review Resume"}
      </button>
    </div>
  );
}

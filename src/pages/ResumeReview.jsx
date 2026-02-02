import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-resume",
        {
          body: { resumeText },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error || !data?.reviewId) {
        throw new Error("Analysis failed");
      }

      navigate(`/dashboard/resume-reviews/${data.reviewId}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-semibold">Resume Review</h1>

      <textarea
        className="w-full min-h-[280px] border rounded-md p-3 text-sm"
        placeholder="Paste your resume here…"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 rounded-md bg-black text-white"
      >
        {loading ? "Analyzing…" : "Get resume feedback"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

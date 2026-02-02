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
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("resume_reviews")
        .insert([
          {
            user_id: user?.id ?? null,
            resume_text: resumeText,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/review/${data.id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Resume Review</h1>
        <p className="text-muted-foreground">
          Clear, ATS-aware feedback — focused on impact, not templates.
        </p>
        <p className="text-sm text-muted-foreground italic">
          Not sure why your resume isn’t getting traction? Start here.
        </p>
      </div>

      {/* What you'll get */}
      <div className="space-y-3">
        <h2 className="font-medium">What you’ll get</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>What recruiters notice first — and what they quietly skip</li>
          <li>Where your experience sounds vague, diluted, or undersold</li>
          <li>ATS issues that reduce visibility without obvious errors</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Plain-English feedback. No rewriting. No gimmicks.
        </p>
      </div>

      {/* Resume input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Paste your resume
        </label>
        <p className="text-xs text-muted-foreground">
          No formatting required. Résumés of any length are fine.
        </p>

        <textarea
          className="w-full min-h-[280px] rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Your resume text is not stored or shared. It’s used only to generate your feedback.
      </p>

      {/* CTA */}
      <div className="space-y-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !resumeText.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-md bg-black text-white text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Get resume feedback"}
        </button>

        <p className="text-xs text-muted-foreground">
          Free • results usually appear in under a minute
        </p>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Trust anchors */}
      <div className="pt-6 border-t space-y-4">
        <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <li>No templates</li>
          <li>No keyword stuffing</li>
          <li>No generic AI rewrite</li>
        </ul>

        <div className="rounded-md bg-muted/50 p-4 space-y-2">
          <h3 className="font-medium text-sm">How BloomBold is different</h3>
          <p className="text-sm text-muted-foreground">
            This isn’t a one-off response. BloomBold is built for ongoing career
            work — not quick edits.
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Your feedback is saved so you can refine over time</li>
            <li>Reviews build on past context instead of starting from scratch</li>
            <li>Guidance reflects hiring patterns, not just wording suggestions</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">
            Think of this as career infrastructure, not a prompt.
          </p>
        </div>
      </div>
    </div>
  );
}

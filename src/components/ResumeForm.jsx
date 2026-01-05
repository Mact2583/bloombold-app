import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ResumeForm = ({ onAnalyze }) => {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("📤 Invoking Edge Function via Supabase SDK");

      const { data, error: functionError } =
        await supabase.functions.invoke("analyze-resume", {
          body: {
            resumeText,
            targetRole,
          },
        });

      console.log("📥 Function response:", data);
      console.log("📥 Function error:", functionError);

      if (functionError) {
        throw functionError;
      }

      onAnalyze(data);
    } catch (err) {
      console.error("❌ Resume analysis failed:", err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Resume Text</label>
        <textarea
          className="w-full min-h-[200px] rounded-md border p-3 text-sm"
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Target Role (optional)
        </label>
        <input
          className="w-full rounded-md border p-3 text-sm"
          placeholder="e.g. Operations Manager, Product Designer"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Analyze Resume"}
      </button>
    </form>
  );
};

export default ResumeForm;

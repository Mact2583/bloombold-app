import { useState } from "react";
import { getAnalyzeResumeUrl } from "@/lib/api";

export default function ResumeReview() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    setError("");
    setResult(null);

    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }

    const endpoint = getAnalyzeResumeUrl();
    if (!endpoint) {
      setError("Analyze endpoint not configured.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          resumeText,
          tier: "free"
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Analyze failed (${res.status}): ${text}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-review">
      <h1>Resume Review</h1>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume here…"
        rows={10}
      />

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing…" : "Analyze (Free)"}
      </button>

      {error && <p className="error">{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

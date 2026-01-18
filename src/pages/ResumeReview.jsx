import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  // 🔁 Redirect AFTER auth is confirmed
  useEffect(() => {
    if (success && user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [success, user, loading, navigate]);

  const handleSubmit = async () => {
    setMessage(null);

    if (!resumeText.trim()) {
      setMessage("Please paste your resume to continue.");
      setMessageType("info");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        setMessage(
          "We couldn’t analyze your resume right now. Please try again."
        );
        setMessageType("error");
        return;
      }

      if (data?.upgradeRequired) {
        setMessage(
          "You’ve used your free resume reviews. Upgrade to Pro to continue."
        );
        setMessageType("upgrade");
        return;
      }

      // ✅ mark success — redirect handled by effect
      setSuccess(true);
      setMessage("Your resume was analyzed successfully.");
      setMessageType("info");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Resume Review</h1>
        <p className="text-gray-600">
          Get clear, ATS-aware feedback on your resume.
        </p>
      </div>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={14}
        className="w-full rounded-md border p-4 text-sm"
        placeholder="Paste your resume text here…"
      />

      {message && (
        <div
          className={`rounded-md p-4 text-sm ${
            messageType === "error"
              ? "bg-red-50 text-red-700"
              : messageType === "upgrade"
              ? "bg-blue-50 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
      >
        {submitting ? "Analyzing…" : "Get resume feedback"}
      </button>
    </div>
  );
}

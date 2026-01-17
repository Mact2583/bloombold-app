import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info"); // info | upgrade | error

  const handleSubmit = async () => {
    setMessage(null);

    if (!resumeText.trim()) {
      setMessage("Please paste your resume to continue.");
      setMessageType("info");
      return;
    }

    if (!session?.access_token) {
      setMessage("Your session has expired. Please log in again.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-resume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: { resumeText },
        }
      );

      if (data?.upgradeRequired) {
        setMessage(
          "You’ve used your 3 free resume reviews. You can return to your dashboard or upgrade to Pro for unlimited reviews."
        );
        setMessageType("upgrade");
        return;
      }

      if (error || data?.error) {
        console.error("Analyze error:", error || data?.error);
        setMessage(
          "We couldn’t analyze your resume right now. Please try again."
        );
        setMessageType("error");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
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
              ? "bg-red-50 text-red-800"
              : messageType === "upgrade"
              ? "bg-yellow-50 text-yellow-900"
              : "bg-blue-50 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Get resume feedback"}
        </button>

        {messageType === "upgrade" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm underline"
            >
              Back to dashboard
            </button>

            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="text-sm font-medium underline"
            >
              Upgrade to Pro
            </button>
          </>
        )}
      </div>
    </div>
  );
}

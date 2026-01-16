import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function ResumeReview() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-resume",
        { body: { resumeText } }
      );

      // 🔐 Not logged in
      if (data?.error === "Unauthorized") {
        setMessage(
          "Please log in to continue. Your resume feedback will be waiting for you."
        );
        setMessageType("info");
        return;
      }

      // 🚧 Free limit reached
      if (data?.upgradeRequired) {
        setMessage(
          "You’ve used your 3 free resume reviews. Upgrade to Pro to continue reviewing and access your full history."
        );
        setMessageType("upgrade");
        return;
      }

      // ❌ Unexpected error
      if (error || data?.error) {
        setMessage(
          "We couldn’t analyze your resume right now. Please try again in a moment."
        );
        setMessageType("error");
        return;
      }

      // ✅ Success
      navigate("/dashboard/resume-reviews");
    } catch {
      setMessage(
        "Something went wrong while analyzing your resume. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Resume Review
        </h1>
        <p className="text-gray-600">
          Get clear, ATS-aware feedback on your resume.
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

      {/* Message */}
      {message && (
        <div
          className={`rounded-md p-4 text-sm ${
            messageType === "upgrade"
              ? "bg-blue-50 text-blue-800"
              : messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Get resume feedback"}
        </button>

        {!user && (
          <button
            onClick={() =>
              navigate("/login", {
                state: { returnTo: "/resume-review" },
              })
            }
            className="text-sm underline"
          >
            Log in
          </button>
        )}

        {messageType === "upgrade" && (
          <button
            onClick={() => navigate("/dashboard/upgrade")}
            className="text-sm font-medium underline"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
}

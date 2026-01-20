import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function FeedbackPulse() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user || submitted) return null;

  const sendFeedback = async (helpful) => {
    try {
      setLoading(true);

      await supabase.from("feedback").insert({
        user_id: user.id,
        helpful,
        context: "dashboard_post_review",
      });

      setSubmitted(true);
    } catch {
      // silently fail — feedback must never break UX
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-gray-50 px-4 py-3 flex items-center justify-between">
      <p className="text-sm text-gray-700">
        Was this resume review helpful?
      </p>

      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => sendFeedback(true)}
          className="text-sm px-3 py-1 rounded-md border hover:bg-white"
        >
          👍 Yes
        </button>

        <button
          disabled={loading}
          onClick={() => sendFeedback(false)}
          className="text-sm px-3 py-1 rounded-md border hover:bg-white"
        >
          👎 Not really
        </button>
      </div>
    </div>
  );
}

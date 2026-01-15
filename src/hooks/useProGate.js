import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export function useProGate({ feature }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    if (!user) {
      setAllowed(false);
      setReason("not_logged_in");
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      // Always check Pro status first
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single();

      if (error) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // Pro users can access everything
      if (profile?.is_pro) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      // ---- FREE USER RULES ----
      switch (feature) {
        case "resume_review": {
          const { count } = await supabase
            .from("resume_reviews")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if ((count ?? 0) >= 3) {
            setAllowed(false);
            setReason("limit_reached");
          } else {
            setAllowed(true);
          }
          break;
        }

        case "resume_review_history":
        case "resume_review_export": {
          setAllowed(false);
          setReason("pro_only");
          break;
        }

        default: {
          setAllowed(false);
          setReason("unknown_feature");
        }
      }

      setLoading(false);
    };

    checkAccess();
  }, [user, feature]);

  return { loading, allowed, reason };
}

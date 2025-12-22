import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Auth callback error:", error);
        navigate("/login", { replace: true });
        return;
      }

      if (data?.session) {
        console.log("✅ Session established");
        navigate("/dashboard", { replace: true });
      } else {
        console.warn("⚠️ No session found");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return <p>Signing you in…</p>;
}

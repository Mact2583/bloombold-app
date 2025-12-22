import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Callback URL:", window.location.href);

    const finalizeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Callback session error:", error);
        navigate("/login", { replace: true });
        return;
      }

      if (data?.session) {
        console.log("✅ Session established");
        navigate("/dashboard", { replace: true });
      } else {
        console.warn("⚠️ No session found in callback");
        navigate("/login", { replace: true });
      }
    };

    finalizeAuth();
  }, [navigate]);

  return <p className="p-6">Signing you in…</p>;
}


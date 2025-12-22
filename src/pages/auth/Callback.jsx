import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const finishAuth = async () => {
      try {
        // ⏳ Give Supabase a moment to complete PKCE exchange
        await new Promise((res) => setTimeout(res, 100));

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error("❌ Error fetching session:", error);
          navigate("/login", { replace: true });
          return;
        }

        if (!session) {
          console.warn("⚠️ No session found after OAuth");
          navigate("/login", { replace: true });
          return;
        }

        console.log("✅ OAuth session established:", session.user.email);

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("❌ Auth callback failure:", err);
        navigate("/login", { replace: true });
      }
    };

    finishAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Signing you in…</h2>
      <p>Please wait while we finish securely logging you in.</p>
    </div>
  );
}

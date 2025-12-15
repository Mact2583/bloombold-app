import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finalizeAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("OAuth exchange error:", error);
        navigate("/login");
        return;
      }

      navigate("/dashboard");
    };

    finalizeAuth();
  }, [navigate]);

  return (
    <div className="p-6 text-center text-gray-600">
      Signing you in…
    </div>
  );
}





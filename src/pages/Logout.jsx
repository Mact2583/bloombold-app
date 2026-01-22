import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await supabase.auth.signOut({
          scope: "global",
        });
      } finally {
        // Hard redirect to guarantee fresh auth state
        window.location.href = "/login";
      }
    };

    logout();
  }, [navigate]);

  return null;
}

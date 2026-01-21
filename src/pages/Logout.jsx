import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        // Always send user to login after logout
        navigate("/login", { replace: true });
      }
    };

    signOut();
  }, [navigate]);

  // Render nothing — this page is a transition only
  return null;
}

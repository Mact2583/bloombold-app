import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      console.log("🔥 Logout page mounted");
      console.log("🔥 Calling supabase.auth.signOut()");

      await supabase.auth.signOut();

      console.log("🔥 signOut finished");

      // Hard redirect to fully reset app state
      window.location.href = "/login";
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Logging out…
    </div>
  );
}

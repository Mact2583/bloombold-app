import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔥 Logout page mounted");

    const signOut = async () => {
      console.log("🔥 Calling supabase.auth.signOut()");
      await supabase.auth.signOut();
      console.log("🔥 signOut finished");
      navigate("/login", { replace: true });
    };

    signOut();
  }, [navigate]);

  return <div>Logging out…</div>;
}

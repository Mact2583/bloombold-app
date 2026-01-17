import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const Logout = () => {
  useEffect(() => {
    const doLogout = async () => {
      await supabase.auth.signOut();

      // Force a clean navigation (avoids Vercel SPA edge cases)
      window.location.href = "/login";
    };

    doLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Signing you out…
    </div>
  );
};

export default Logout;

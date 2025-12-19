import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      window.location.href = "/login";
    }
    doLogout();
  }, []);

  return (
    <div className="p-6 text-center text-gray-600">
      Logging out...
    </div>
  );
}

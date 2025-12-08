import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleAuth() {
      // force Supabase to refresh and store the session
      await supabase.auth.getSession();
      navigate("/tools");
    }

    handleAuth();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default AuthCallback;

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bloombold.io/auth/callback",
      },
    });
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>

      {/* Google sign-in */}
      <button
        onClick={signInWithGoogle}
        className="bg-red-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Continue with Google
      </button>

      {/* OPTIONAL: Email login can be added later */}
      <div className="mt-4">
        <p className="text-gray-600 text-sm">
          Email login coming soon — use Google for now.
        </p>
      </div>
    </div>
  );
};

export default Login;




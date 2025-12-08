import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");

  async function signUp(e) {
    e.preventDefault();
    await supabase.auth.signUp({
      email,
      options: {
        emailRedirectTo: "https://bloombold.io/auth/callback",
      },
    });
  }

  return (
    <div className="auth-container">
      <h1>Create Your Account</h1>

      <form onSubmit={signUp}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

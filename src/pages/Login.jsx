import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <button
        onClick={signInWithGoogle}
        className="bg-red-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Continue with Google
      </button>

      <p className="text-gray-600 text-sm text-center">
        Use Google to sign in.
      </p>
    </div>
  );
};

export default Login;




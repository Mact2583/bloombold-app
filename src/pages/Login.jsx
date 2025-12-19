import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, loading, navigate]);

  const signInWithGoogle = async () => {
    console.log("🚀 Starting Google OAuth");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bloombold.io/auth/callback",
      },
    });

    if (error) {
      console.error("❌ OAuth error:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <button
        type="button"
        onClick={signInWithGoogle}
        className="bg-red-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Continue with Google
      </button>
    </div>
  );
}








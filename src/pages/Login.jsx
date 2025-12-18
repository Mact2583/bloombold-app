import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  // ✅ WAIT for auth hydration before redirecting
  useEffect(() => {
    if (!loading && session) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, session, navigate]);

  // ✅ PKCE OAuth (NO custom callback page)
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bloombold.io",
      },
    });
  };

  // Optional UX: avoid flashing login while loading
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Checking session…
      </div>
    );
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





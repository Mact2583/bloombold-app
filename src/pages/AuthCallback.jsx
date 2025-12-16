import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Let Supabase hydrate the session
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-6 text-center text-gray-600">
      Signing you in…
    </div>
  );
}






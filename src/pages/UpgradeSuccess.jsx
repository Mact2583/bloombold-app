import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function UpgradeSuccess() {
  const navigate = useNavigate();
  const { loading, user, refreshProfile } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      refreshProfile();
      navigate("/dashboard", {
        replace: true,
        state: { upgradeSuccess: true },
      });
    }
  }, [loading, user, navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-600">
        Finalizing your upgrade…
      </p>
    </div>
  );
}

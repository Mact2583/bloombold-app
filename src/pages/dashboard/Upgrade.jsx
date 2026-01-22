import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import ProSuccessModal from "@/components/ProSuccessModal";

export default function Upgrade() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPro, loading: authLoading } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const params = new URLSearchParams(location.search);
    const isSuccess = params.get("success") === "1";
    const alreadySeen = localStorage.getItem("bb_pro_success_seen");

    if (isSuccess && isPro && !alreadySeen) {
      setShowSuccess(true);
    }

    // Clean URL
    if (isSuccess) {
      navigate("/dashboard/upgrade", { replace: true });
    }
  }, [authLoading, isPro, location.search, navigate]);

  if (authLoading) return null;

  if (!user) {
    navigate("/login", {
      replace: true,
      state: { returnTo: "/dashboard/upgrade" },
    });
    return null;
  }

  return (
    <>
      {showSuccess && (
        <ProSuccessModal
          onClose={() => {
            setShowSuccess(false);
            navigate("/dashboard");
          }}
        />
      )}

      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          BloomBold Pro
        </h1>

        <p className="text-gray-600">
          Manage your subscription and billing details.
        </p>
      </div>
    </>
  );
}

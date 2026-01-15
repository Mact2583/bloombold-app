import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function Upgrade() {
  const navigate = useNavigate();
  const { user, isPro, profileLoading } = useAuth();

  // ✅ Redirect ONLY after profile is known
  useEffect(() => {
    if (!profileLoading && isPro) {
      navigate("/dashboard", { replace: true });
    }
  }, [profileLoading, isPro, navigate]);

  // ⏳ Waiting on profile (NOT auth)
  if (profileLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your plan…
      </div>
    );
  }

  // 🧠 Safety — user should always exist here due to ProtectedRoute
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-semibold">
        Upgrade to BloomBold Pro
      </h1>

      <p className="text-gray-600">
        Unlock unlimited resume reviews, saved history, and PDF exports.
      </p>

      <div className="rounded-lg border p-6 space-y-4">
        <ul className="list-disc pl-5 text-gray-700">
          <li>Unlimited resume reviews</li>
          <li>Saved review history</li>
          <li>PDF exports</li>
          <li>Priority improvements</li>
        </ul>

        <button
          onClick={() => navigate("/dashboard/billing")}
          className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-900"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}

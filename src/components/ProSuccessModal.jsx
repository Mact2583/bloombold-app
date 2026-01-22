import { useEffect } from "react";

export default function ProSuccessModal({ onClose }) {
  useEffect(() => {
    // Lock it to once per browser
    localStorage.setItem("bb_pro_success_seen", "true");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          You’re Pro 🎉
        </h2>

        <p className="text-gray-700">
          You now have unlimited resume reviews, full history access,
          and all upcoming tools included.
        </p>

        <p className="text-sm text-gray-500">
          Thanks for supporting BloomBold — we’re glad you’re here.
        </p>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-[#7D77DF] px-6 py-3 text-white font-medium hover:bg-[#6A64D8]"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

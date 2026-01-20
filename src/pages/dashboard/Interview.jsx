import ComingSoonBadge from "@/components/ComingSoonBadge";

export default function Interview() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          Interview Prep
        </h1>
        <ComingSoonBadge />
      </div>

      <p className="text-gray-600">
        Practice interviews with structure and clarity — not generic questions.
      </p>

      <div className="space-y-4 text-gray-700">
        <p>
          We’re building guided interview preparation that helps you:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>Prepare thoughtful, role-specific answers</li>
          <li>Identify gaps before the real interview</li>
          <li>Build confidence through repetition and feedback</li>
        </ul>

        <p className="text-sm text-gray-500">
          This feature will be included with BloomBold Pro.
        </p>
      </div>
    </div>
  );
}

import ComingSoonBadge from "@/components/ComingSoonBadge";

export default function Mentor() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Title + badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Career Mentor
        </h1>
        <ComingSoonBadge />
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 mt-2">
        A calm, experienced voice — available when you need perspective.
      </p>

      {/* Body */}
      <div className="space-y-4 text-gray-700">
        <p>
          We’re building an AI mentor designed to help you:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>Think through career decisions</li>
          <li>Sense-check job offers and pivots</li>
          <li>Reflect without judgment or hustle culture</li>
        </ul>

        <p className="text-sm text-gray-500">
          This feature will roll out to BloomBold Pro members.
        </p>
      </div>
    </div>
  );
}

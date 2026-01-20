import ComingSoonBadge from "@/components/ComingSoonBadge";

export default function Journal() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Title + badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Career Journal</h1>
        <ComingSoonBadge />
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          The Career Journal will help you:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>Reflect after interviews and resume revisions</li>
          <li>Capture insights about roles, companies, and goals</li>
          <li>Build a private record of your career decisions over time</li>
        </ul>

        <p className="text-sm text-gray-500">
          Designed for clarity — not productivity pressure.
        </p>
      </div>
    </div>
  );
}

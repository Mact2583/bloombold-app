export default function Mentor() {
  return (
    <div className="max-w-3xl space-y-6 relative">
      <span className="absolute right-0 top-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        Coming soon
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          AI Career Mentor
        </h1>
        <p className="text-gray-600 mt-2">
          A calm, experienced voice — available when you need perspective.
        </p>
      </div>

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

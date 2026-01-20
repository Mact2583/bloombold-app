export default function Journal() {
  return (
    <div className="max-w-3xl space-y-6 relative">
      <span className="absolute right-0 top-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        Coming soon
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Career Journal
        </h1>
        <p className="text-gray-600 mt-2">
          Track your thinking as your career evolves.
        </p>
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

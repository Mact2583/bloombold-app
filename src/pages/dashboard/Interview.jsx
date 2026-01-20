export default function Interview() {
  return (
    <div className="max-w-3xl space-y-6 relative">
      <span className="absolute right-0 top-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        Coming soon
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Interview Prep
        </h1>
        <p className="text-gray-600 mt-2">
          Practice interviews with structure and clarity — not generic questions.
        </p>
      </div>

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

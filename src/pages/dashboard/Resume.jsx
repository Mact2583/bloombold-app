export default function Resume() {
  return (
    <div className="max-w-3xl space-y-6 relative">
      <span className="absolute right-0 top-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        Coming soon
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Resume Builder
        </h1>
        <p className="text-gray-600 mt-2">
          Your resume, shaped with intention — not templates.
        </p>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          We’re working on a resume builder that:
        </p>

        <ul className="list-disc pl-6 space-y-1">
          <li>Aligns with BloomBold’s review framework</li>
          <li>Supports thoughtful iteration, not endless edits</li>
          <li>Keeps progress connected to past feedback</li>
        </ul>

        <p className="text-sm text-gray-500">
          For now, resume reviews remain the fastest way to improve your resume.
        </p>
      </div>
    </div>
  );
}

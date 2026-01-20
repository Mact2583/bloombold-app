import ComingSoonBadge from "@/components/ComingSoonBadge";

export default function Resume() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Title + badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          Resume Builder
        </h1>
        <ComingSoonBadge />
      </div>

        <p className="text-gray-600 mt-2">
          Your resume, shaped with intention — not templates.
        </p>

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

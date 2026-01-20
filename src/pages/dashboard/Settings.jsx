export default function Settings() {
  return (
    <div className="max-w-3xl space-y-6 relative">
      <span className="absolute right-0 top-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
        More coming
      </span>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your BloomBold experience.
        </p>
      </div>

      <p className="text-gray-700">
        Additional preferences and account controls will be added here as the
        platform evolves.
      </p>
    </div>
  );
}

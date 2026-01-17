export default function LoadingSkeleton() {
  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

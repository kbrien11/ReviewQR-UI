export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto animate-pulse">

      {/* KPI Skeleton Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-gray-200 border border-gray-300/40"
          />
        ))}
      </div>

      {/* Middle Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="h-40 rounded-xl bg-gray-200 border border-gray-300/40" />
        <div className="h-40 rounded-xl bg-gray-200 border border-gray-300/40" />
        <div className="h-40 rounded-xl bg-gray-200 border border-gray-300/40" />
      </div>

      {/* Large Bottom Widget */}
      <div className="h-48 rounded-xl bg-gray-200 border border-gray-300/40" />
    </div>
  );
}
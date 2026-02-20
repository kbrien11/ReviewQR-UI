export default function DashboardSkeleton() {
    return (
      <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-xl" />
          ))}
        </div>
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="md:col-span-3 h-48 bg-gray-300 rounded-xl" />
      </div>
    );
  }
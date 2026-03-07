export default function ReviewsFilters({ filter, setFilter }) {
  const filters = [
    { key: "all", label: "All" },
    { key: "public", label: "Public" },
    { key: "private", label: "Private" },
    { key: "mobile", label: "Mobile" },
    { key: "desktop", label: "Desktop" },
  ];

  return (
    <div
      className="
        
        rounded-2xl px-3 py-3
        overflow-x-auto no-scrollbar
      "
    >
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200 active:scale-[.97]
              ${filter === f.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-gray-700 border border-gray-200 shadow-sm"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
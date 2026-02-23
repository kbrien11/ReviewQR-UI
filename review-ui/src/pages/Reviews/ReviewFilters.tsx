export default function ReviewsFilters({ filter, setFilter }) {
    const filters = [
      { key: "all", label: "All" },
      { key: "public", label: "Public" },
      { key: "private", label: "Private" },
      { key: "mobile", label: "Mobile" },
      { key: "desktop", label: "Desktop" },
    ];
  
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition
              ${filter === f.key
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    );
  }
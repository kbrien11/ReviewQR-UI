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
        {filters.map((f) => {
          const isActive = filter === f.key;

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 active:scale-[.96]
                backdrop-blur-xl
                ${isActive
                  ? `
                      bg-indigo-600 text-white
                      shadow-[0_4px_12px_rgba(99,102,241,0.35)]
                      border border-indigo-500/60
                      scale-[1.02]
                    `
                  : `
                      bg-white/80 text-gray-700
                      border border-gray-200/70
                      shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                      hover:bg-white/90
                    `
                }
              `}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
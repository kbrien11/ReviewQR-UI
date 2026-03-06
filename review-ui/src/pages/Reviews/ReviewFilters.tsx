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
        w-full overflow-x-auto no-scrollbar
        py-2
      "
    >
      <div
        className="
          flex items-center gap-2
          bg-white/70 dark:bg-gray-900/40
          backdrop-blur-xl
          border border-gray-200/60 dark:border-gray-700/60
          rounded-full
          px-2 py-2
          shadow-[0_4px_14px_rgba(0,0,0,0.06)]
        "
      >
        {filters.map((f) => {
          const active = filter === f.key;

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium
                whitespace-nowrap transition-all duration-300
                ${active
                  ? "text-white bg-indigo-600 shadow-md shadow-indigo-300/40"
                  : "text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {f.label}

              {/* Active glow ring */}
              {active && (
                <span
                  className="
                    absolute inset-0 rounded-full
                    bg-indigo-500/30 blur-md
                    -z-10
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
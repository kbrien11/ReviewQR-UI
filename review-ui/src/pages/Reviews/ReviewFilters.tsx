import { motion, useReducedMotion } from "framer-motion";

const filters = [
  { key: "all", label: "All Reviews" },
  { key: "public", label: "Public" },
  { key: "private", label: "Private" },
  { key: "mobile", label: "Mobile" },
  { key: "desktop", label: "Desktop" },
];

export default function ReviewsFilters({ filter = "all", setFilter }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full">
      <div
        role="group"
        aria-label="Filter reviews"
        className="flex w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-gray-200/80 bg-gray-50/80 p-1.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((item) => {
          const isActive = filter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={isActive}
              className={`relative isolate flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-indigo-700"
                  : "text-gray-500 hover:bg-white hover:text-gray-900"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="reviews-filter-active"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                  className="absolute inset-0 -z-10 rounded-xl border border-indigo-100 bg-white shadow-sm"
                  aria-hidden="true"
                />
              )}

              <span>{item.label}</span>

              {isActive && (
                <motion.span
                  initial={prefersReducedMotion ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { motion, useReducedMotion } from "framer-motion";

const tabs = [
  { id: "all", label: "All Reviews" },
  { id: "google", label: "Google" },
  { id: "internal", label: "Internal" },
];

export default function ReviewsTabs({ active = "all", onChange }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Review sources"
      className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl border border-gray-200/80 bg-gray-100/80 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            id={`reviews-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="reviews-tab-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange?.(tab.id)}
            className={`relative isolate flex min-w-0 flex-1 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:px-5 ${
              isActive
                ? "text-indigo-700"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="reviews-tabs-indicator"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className="absolute inset-0 -z-10 rounded-xl border border-gray-200/80 bg-white shadow-sm"
                aria-hidden="true"
              />
            )}

            <span>{tab.label}</span>

            {isActive && (
              <motion.span
                initial={prefersReducedMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
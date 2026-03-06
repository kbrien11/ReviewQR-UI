import { motion } from "framer-motion";

export default function ReviewsTabs({ active, onChange }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "google", label: "Google" },
    { id: "internal", label: "Internal" },
  ];

  return (
    <>
      {/* MOBILE — Apple-style segmented control */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar py-2">
        <div
          className="
            relative flex items-center gap-1
            bg-white/70 dark:bg-gray-900/40
            backdrop-blur-xl
            border border-gray-200/60 dark:border-gray-700/60
            rounded-full
            px-2 py-2
            shadow-[0_4px_14px_rgba(0,0,0,0.06)]
          "
        >
          {/* Sliding Active Pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              absolute top-1 bottom-1
              rounded-full
              bg-indigo-600
              shadow-md shadow-indigo-300/40
            "
            style={{
              left: `${tabs.findIndex(t => t.id === active) * (100 / tabs.length)}%`,
              width: `${100 / tabs.length}%`,
            }}
          />

          {/* Tabs */}
          {tabs.map((t) => {
            const isActive = active === t.id;

            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`
                  relative z-10 flex-1 text-center
                  px-4 py-2
                  text-sm font-medium
                  transition-all duration-300
                  ${isActive ? "text-white" : "text-gray-700 dark:text-gray-300"}
                `}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP — keep your original underline tabs */}
      <div className="hidden md:flex gap-6 border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`
              pb-3 text-sm font-medium transition
              ${active === t.id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}
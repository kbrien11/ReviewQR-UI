import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FuturisticKPI({
  label,
  value,
  icon,
  percent = 100,
  hint = "", // tooltip text
  subtext = "" // optional small text under label
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (start === end) return;

    const duration = 900;
    const stepTime = 1000 / 60;
    const increment = (end - start) / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative p-6 rounded-2xl
        bg-white
        border border-gray-200
        shadow-sm
        flex flex-col gap-4
        transition-all
      "
    >
      {/* Icon with depth */}
      <div
        className="
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-gray-50 to-gray-100
          border border-gray-200
          flex items-center justify-center
          text-3xl text-indigo-600
          shadow-inner
        "
      >
        {icon}
      </div>

      {/* Label + Tooltip */}
      <div className="relative group w-fit">
        <p className="text-gray-700 text-sm font-medium tracking-wide flex items-center gap-1">
          {label}

          {/* Tooltip trigger (small info icon) */}
          {hint && (
            <span className="text-gray-400 text-xs cursor-default">ℹ️</span>
          )}
        </p>

        {/* Tooltip */}
        {hint && (
          <div
            className="
              absolute left-0 top-6
              w-max max-w-xs
              bg-white text-gray-700 text-xs
              px-3 py-2 rounded-lg shadow-lg border border-gray-200
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              z-20
            "
          >
            {hint}
          </div>
        )}

        {/* Optional subtext */}
        {subtext && (
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        )}
      </div>

      {/* Value */}
      <p className="text-4xl font-semibold text-gray-900 tracking-tight">
        {displayValue}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}
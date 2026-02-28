import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FuturisticKPI({
  label,
  value,
  icon,
  percent = 100,
  hint = "", // tooltip text
  subtext = "",
  trend // optional small text under label
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


  ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative p-5 rounded-2xl
        bg-white
        border border-gray-200
        shadow-sm
        flex flex-col gap-4
        transition-all
      "
    >
      {/* Top Row: Icon + Label */}
      <div className="flex items-center justify-between">
        <div className="
          w-12 h-12 rounded-xl
          bg-gray-100
          flex items-center justify-center
          text-2xl text-gray-700
        ">
          {icon}
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {subtext && (
            <p className="text-xs text-gray-400">{subtext}</p>
          )}
        </div>
      </div>

      {/* Value */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-4xl font-semibold text-gray-900 tracking-tight"
      >
        {value}
      </motion.p>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2">
        {/* Arrow + Percent */}
        <span
          className={`
      text-sm font-semibold
      ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500"}
      flex items-center gap-1
    `}
        >
          {trend > 0 && "▲"}
          {trend < 0 && "▼"}
          {trend}%
        </span>

        {/* Sparkline */}
        <svg
          className={`
      w-16 h-6
      ${trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-400"}
      opacity-70
    `}
          viewBox="0 0 100 30"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="0,20 20,15 40,18 60,10 80,12 100,5"
          />
        </svg>
      </div>
    </motion.div>
  );
}
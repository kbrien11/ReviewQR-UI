import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardCard({
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


  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        w-full
        relative 
        p-5 md:p-6 
        rounded-2xl
        bg-white/95 md:bg-white
        backdrop-blur-md md:backdrop-blur-none
        border border-gray-200/70 md:border-gray-200
        shadow-[0_6px_18px_rgba(0,0,0,0.06)]
        flex flex-col 
        gap-4
      "
    >

      {/* VALUE */}
      <p
        className="
          text-3xl md:text-4xl 
          font-semibold 
          text-gray-900 
          tracking-tight 
          leading-none
        "
      >
        {value}
      </p>

      {/* LABEL + SUBTEXT */}
      <div className="flex flex-col leading-tight">
        <p className="text-sm font-semibold text-gray-900 tracking-tight">
          {label}
        </p>
        {subtext && (
          <p className="text-xs text-gray-400">{subtext}</p>
        )}
      </div>

      {/* TREND */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`
            text-sm font-semibold
            ${trend > 0 ? "text-green-600" :
              trend < 0 ? "text-red-600" :
                "text-gray-500"}
          `}
        >
          {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"}
        </span>

        <span
          className={`
            text-sm font-semibold
            ${trend > 0 ? "text-green-600" :
              trend < 0 ? "text-red-600" :
                "text-gray-600"}
          `}
        >
          {trend > 0 ? `+${trend}%` : `${trend}%`}
        </span>

        <span
          className={`
            px-2 py-0.5 rounded-full 
            text-[11px] md:text-xs font-medium
            shadow-sm
            ${trend > 0 ? "bg-green-100 text-green-700" :
              trend < 0 ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-600"}
          `}
        >
          {trend > 0 ? "Growing" : trend < 0 ? "Declining" : "Stable"}
        </span>
      </div>

      {/* SPARKLINE */}
      <div className="mt-2">
        <svg
          className={`
            w-full h-12 md:h-12
            ${trend > 0 ? "text-green-500" :
              trend < 0 ? "text-red-500" :
                "text-gray-300"}
            opacity-90
          `}
          viewBox="0 0 100 30"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transition: "all 0.4s ease" }}
            points={
              trend > 0
                ? "0,25 20,20 40,18 60,12 80,10 100,5"
                : trend < 0
                  ? "0,5 20,10 40,12 60,18 80,22 100,25"
                  : "0,15 20,15 40,15 60,15 80,15 100,15"
            }
          />
        </svg>

        <p className="text-[11px] md:text-[11px] text-gray-400 mt-1">
          vs previous 3 days
        </p>
      </div>

    </motion.div>
  );
}
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
        scale: 1.025,
        y: -3,
        boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
      w-full relative overflow-hidden
      p-5 md:p-6
      rounded-[28px]
      bg-white/65
      backdrop-blur-3xl
      border border-white/50
      shadow-[0_6px_28px_rgba(0,0,0,0.05)]
      flex flex-col gap-6
      transition-all duration-300
      active:scale-[.98]
  "
    >

      {/* Soft gradient glow */}
      <div className="
    absolute inset-0 pointer-events-none
    bg-gradient-to-br from-white/50 to-transparent
  " />

      {/* Subtle top highlight */}
      <div className="
    absolute top-0 left-0 right-0 h-[1px]
    bg-gradient-to-r from-transparent via-white/70 to-transparent
  " />

      <p
        className="
            text-[2.6rem] md:text-[3rem]
            font-semibold
            text-black-900
            tracking-[-0.02em]
            leading-none
            font-[system-ui,-apple-system,'SF Pro Display','SF Pro Text']
          "
      >
        {value}
      </p>

      {/* LABEL + SUBTEXT */}
      <div className="flex flex-col leading-tight">
        <p
          className="
              text-[0.78rem] md:text-sm
              font-medium
              text-black-700
              tracking-tight
              font-[system-ui,-apple-system,'SF Pro Text']
            "
        >
          {label}
        </p>
        {subtext && (
          <p className="text-xs text-gray-400">
            {subtext}
          </p>
        )}
      </div>

      {/* TREND */}
      <div className="flex items-center gap-2 mt-1">

        {/* Trend Icon */}
        <motion.span
          animate={{ y: trend > 0 ? -2 : trend < 0 ? 2 : 0 }}
          transition={{ duration: 0.3 }}
          className={`
        text-sm font-semibold
        ${trend > 0 ? "text-green-600" :
              trend < 0 ? "text-red-600" :
                "text-gray-500"}
      `}
        >
          {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"}
        </motion.span>

        {/* Trend % */}
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

        {/* Trend Badge */}
        <span
          className={`
        px-2 py-0.5 rounded-full text-[11px] font-medium
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
      <div className="mt-1 relative">

        {/* Glow behind sparkline */}
        <div className={`
      absolute inset-0 blur-xl opacity-30
      ${trend > 0 ? "bg-green-400/40" :
            trend < 0 ? "bg-red-400/40" :
              "bg-gray-300/40"}
    `} />

        <svg
          className={`
        w-full h-14 md:h-16 relative
        ${trend > 0 ? "text-green-500" :
              trend < 0 ? "text-red-500" :
                "text-gray-300"}
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

        <p className="text-[11px] text-gray-900 mt-1">
          vs previous 7 days
        </p>
      </div>

    </motion.div>
  );
}
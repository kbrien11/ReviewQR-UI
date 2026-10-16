import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  if (!Number.isFinite(number)) return value;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(number);
}

function getTrendStyles(trend) {
  if (trend > 0) {
    return {
      text: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
      line: "text-emerald-500",
      fill: "text-emerald-500",
      label: "Growing",
    };
  }

  if (trend < 0) {
    return {
      text: "text-rose-700",
      badge: "bg-rose-50 text-rose-700 ring-rose-600/15",
      line: "text-rose-500",
      fill: "text-rose-500",
      label: "Declining",
    };
  }

  return {
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-600 ring-gray-500/10",
    line: "text-gray-400",
    fill: "text-gray-400",
    label: "Stable",
  };
}

function TrendIcon({ trend }) {
  if (trend > 0) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M4 13l5-5 3 3 4-5M11.5 6H16v4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (trend < 0) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M4 7l5 5 3-3 4 5M11.5 14H16V9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 10h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkline({ trend, color }) {
  const points =
    trend > 0
      ? "0,23 16,20 32,22 48,13 64,16 80,8 100,4"
      : trend < 0
        ? "0,5 16,8 32,6 48,15 64,12 80,21 100,25"
        : "0,15 16,13 32,16 48,14 64,15 80,13 100,15";

  const areaPoints = `0,30 ${points} 100,30`;

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={`h-12 w-full ${color}`}
      role="img"
      aria-label={
        trend > 0
          ? "Illustrative upward trend"
          : trend < 0
            ? "Illustrative downward trend"
            : "Illustrative stable trend"
      }
    >
      <defs>
        <linearGradient id={`sparkline-${trend > 0 ? "up" : trend < 0 ? "down" : "flat"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill="currentColor"
        opacity="0.07"
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function DashboardCard({
  label,
  value,
  icon,
  percent,
  hint = "",
  subtext = "",
  trend,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const numericValue =
    value !== null && value !== "" && Number.isFinite(Number(value))
      ? Number(value)
      : null;

  const hasNumericValue = numericValue !== null;
  const hasTrend =
    trend !== null &&
    trend !== undefined &&
    trend !== "" &&
    Number.isFinite(Number(trend));

  const numericTrend = hasTrend ? Number(trend) : 0;
  const trendStyles = getTrendStyles(numericTrend);

  useEffect(() => {
    if (!hasNumericValue) {
      setDisplayValue(0);
      return;
    }

    if (prefersReducedMotion) {
      setDisplayValue(numericValue);
      return;
    }

    const end = numericValue;
    const duration = 850;
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(end * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, hasNumericValue, prefersReducedMotion]);

  const displayedValue = hasNumericValue
    ? formatValue(displayValue)
    : formatValue(value);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -3, boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)" }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      title={hint || undefined}
      className="group relative flex min-h-[218px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-indigo-200 sm:p-6"
    >
      {/* Soft decorative accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-50/80 blur-2xl transition-colors duration-300 group-hover:bg-indigo-100/80" />

      {/* Metric heading */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>

          {subtext && (
            <p className="mt-1 text-xs leading-5 text-gray-400">{subtext}</p>
          )}
        </div>

        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100/80 bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105">
            <div className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="relative mt-5">
        <p className="text-3xl font-bold tracking-tight text-gray-950 sm:text-[2.15rem]">
          {displayedValue}
        </p>
      </div>

      {/* Trend */}
      <div className="relative mt-auto pt-5">
        {hasTrend ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trendStyles.badge} ring-1 ring-inset`}
              >
                <TrendIcon trend={numericTrend} />
                {numericTrend > 0 ? "+" : ""}
                {numericTrend}%
              </span>

              <span className="text-xs text-gray-500">
                {trendStyles.label}
              </span>
            </div>

            <div className="mt-3">
              <Sparkline
                trend={numericTrend}
                color={trendStyles.line}
              />
              <p className="mt-1 text-[11px] text-gray-400">
                vs. previous 7 days
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <p className="text-xs text-gray-500">
              {percent !== undefined && percent !== null
                ? `${percent}% of target`
                : "Your latest performance"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
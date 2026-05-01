import { Link } from "react-router-dom";
import DeviceRing from "./DeviceRing";

export default function DeviceBreakdown({ scans, reviews }) {
  const conversionRate = scans > 0 ? (reviews / scans) * 100 : 0;

  return (
    <div
      className="
      relative overflow-hidden
      bg-white/60 
      backdrop-blur-3xl
      rounded-[28px]
      border border-white/50
      shadow-[0_6px_28px_rgba(0,0,0,0.05)]
      p-6 space-y-6
      transition-all duration-300
      active:scale-[.98]
      "
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 blur-3xl rounded-full" />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Conversion Analytics
        </h2>

        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 font-semibold text-sm">
          {conversionRate.toFixed(1)}%
        </div>
      </div>

      {/* Conversion Bar */}
      <div className="relative z-10 space-y-3">
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"
          style={{ transform: "skewX(-20deg)" }}
        />
        <p className="text-sm font-medium text-gray-700">
          Scan → Review Conversion
        </p>

        <div className="w-full bg-gray-200/60 h-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${conversionRate}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{scans} scans</span>
          <span>{reviews} reviews</span>
          {/* <span className="font-semibold text-gray-700">
            {conversionRate.toFixed(1)}%
          </span> */}
        </div>
      </div>
    </div>
  );
}
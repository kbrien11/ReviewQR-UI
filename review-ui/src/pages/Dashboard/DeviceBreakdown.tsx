import { Link } from "react-router-dom";
import DeviceRing from "./DeviceRing";

export default function DeviceBreakdown({ data, slug }) {
  const mobile = data.mobile || 0;
  const desktop = data.desktop || 0;

  // THE FIX — correct total
  const total = mobile + desktop;

  return (
    <div
      className="
      relative overflow-hidden
      bg-white/60 
      backdrop-blur-3xl
      rounded-[28px]
      border border-white/50
      shadow-[0_6px_28px_rgba(0,0,0,0.05)]
      p-6 space-y-7
      transition-all duration-300
      active:scale-[.98]
      "
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
          Device Breakdown
        </h2>

        <Link
          to={`/scans/${slug}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition"
        >
          View More →
        </Link>
      </div>

      {/* Device Rings */}
      <div className="grid grid-cols-2 gap-6 relative z-10">

        <DeviceRing
          label="Mobile"
          icon="📱"
          value={mobile}
          total={total}
          from="#60A5FA"   // blue-400
          to="#2563EB"     // blue-600
        />

        <DeviceRing
          label="Desktop"
          icon="💻"
          value={desktop}
          total={total}
          from="#C084FC"   // purple-400
          to="#7C3AED"     // purple-600
        />

      </div>
    </div>
  );
}
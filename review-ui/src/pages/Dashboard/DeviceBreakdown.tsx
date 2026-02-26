import { Link } from "react-router-dom";

export default function DeviceBreakdown({
  slug,
  data,
  mobilePct,
  desktopPct,
  mobileTrend,
  desktopTrend,
}: {
  slug: string;
  data: any;
  mobilePct: number;
  desktopPct: number;
  mobileTrend: number[];
  desktopTrend: number[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Device Breakdown
        </h2>

        <Link
          to={`/scans/${slug}`}
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          View More →
        </Link>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* MOBILE */}
        <DeviceCard
          label="Mobile"
          icon="📱"
          value={data.mobile || 0}
          percent={mobilePct}
          color="stroke-blue-500"
          barColor="bg-blue-500"
          trend={mobileTrend || []}
        />

        {/* DESKTOP */}
        <DeviceCard
          label="Desktop"
          icon="💻"
          value={data.desktop || 0}
          percent={desktopPct}
          color="stroke-purple-500"
          barColor="bg-purple-500"
          trend={desktopTrend || []}
        />

      </div>
    </div>
  );
}

function DeviceCard({
  label,
  icon,
  value,
  percent,
  color,
  barColor,
  trend,
}: {
  label: string;
  icon: string;
  value: number;
  percent: number;
  color: string;
  barColor: string;
  trend: number[];
}) {
  return (
    <div
      className="
        p-5 rounded-xl border border-gray-200 shadow-sm bg-white
        space-y-4 transition-all hover:shadow-md hover:-translate-y-[2px]
      "
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
          {icon}
        </div>

        <div>
          <p className="text-gray-700 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="w-full h-16">
        <Sparkline data={trend} strokeColor={color} />
      </div>

      {/* Percent Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm text-gray-500">{percent}% of total scans</p>
    </div>
  );
}

function Sparkline({
  data,
  strokeColor,
}: {
  data: number[];
  strokeColor: string;
}) {
  // Prevent crash if data is empty or undefined
  if (!data || data.length === 0) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          strokeWidth="3"
          className={strokeColor}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <polyline
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={strokeColor}
        points={points}
      />
    </svg>
  );
}
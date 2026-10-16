
import { useMemo } from "react";
import DeviceRing from "./DeviceRing";

export default function DeviceBreakdown({ scans = 0, reviews = 0 }) {
  const analytics = useMemo(() => {
    const totalScans = Math.max(0, Number(scans) || 0);
    const totalReviews = Math.max(0, Number(reviews) || 0);

    const conversionRate =
      totalScans > 0 ? (totalReviews / totalScans) * 100 : 0;

    return {
      scans: totalScans,
      reviews: totalReviews,
      conversionRate,
      progress: Math.min(100, conversionRate),
    };
  }, [scans, reviews]);

  const { scans: totalScans, reviews: totalReviews, conversionRate, progress } =
    analytics;

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:shadow-lg hover:shadow-indigo-950/[0.04] sm:p-7">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-100/60 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
                <path d="M14 14h3v3h-3zM20 14v2M17 20h4M20 18v3" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Scan-to-review performance
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                How scans translate into reviews
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-2.5 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            Conversion
          </p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-indigo-700 tabular-nums">
            {conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Conversion progress */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">
            Scan → Review conversion
          </span>
          <span className="text-xs font-medium text-slate-500">
            {totalScans > 0
              ? `${totalReviews.toLocaleString()} of ${totalScans.toLocaleString()}`
              : "No scans yet"}
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/70"
          role="progressbar"
          aria-label="Scan to review conversion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-medium text-slate-500">
              Total scans
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {totalScans.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Customer QR scans
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500">
              Total reviews
            </span>
          </div>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {totalReviews.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Reviews submitted
          </p>
        </div>
      </div>

      {/* Helpful context */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 px-4 py-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>

        <p className="text-xs leading-5 text-slate-500">
          Conversion is calculated by dividing reviews by QR scans. Use this
          metric to track how effectively your QR experience encourages
          customers to leave feedback.
        </p>
      </div>
    </section>
  );
}

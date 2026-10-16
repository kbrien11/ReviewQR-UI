
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import { fetchWithTimeout } from "../../utils/FetchWithTimer";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Laptop,
  LoaderCircle,
  QrCode,
  RefreshCw,
  Smartphone,
  Tablet,
  TrendingUp,
} from "lucide-react";

const API_BASE = "https://reviewqrapi.onrender.com/api";

const numberFormat = new Intl.NumberFormat("en-US");

function formatNumber(value) {
  return numberFormat.format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDeviceIcon(deviceType) {
  const type = String(deviceType || "").toLowerCase();

  if (type.includes("tablet")) return Tablet;
  if (type.includes("mobile") || type.includes("phone")) {
    return Smartphone;
  }

  return Laptop;
}

function getDeviceLabel(deviceType) {
  const type = String(deviceType || "").toLowerCase();

  if (type.includes("tablet")) return "Tablet";
  if (type.includes("mobile") || type.includes("phone")) return "Mobile";

  if (type.includes("desktop")) return "Desktop";

  return deviceType || "Unknown";
}

function MetricCard({ label, value, description, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            {formatNumber(value)}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">{description}</p>
    </motion.div>
  );
}

function SectionCard({ title, description, icon: Icon, children, action }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 ring-1 ring-gray-200/80">
              <Icon size={18} strokeWidth={1.8} />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm leading-5 text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-5 h-9 w-28 rounded bg-gray-100" />
            <div className="mt-4 h-3 w-32 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 ring-1 ring-gray-200">
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function QRPreview() {
  const { token, setApiOffline, setApiBackendError } = useAuth();
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchScans() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchWithTimeout(
          `${API_BASE}/business/${encodeURIComponent(slug || "")}/analytics/summary/`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setApiBackendError?.(true);
            throw new Error("Your session may have expired. Please sign in again.");
          }

          if (response.status >= 500) {
            setApiBackendError?.(true);
            throw new Error("The analytics service is temporarily unavailable.");
          }

          throw new Error(
            response.status === 404
              ? "Business analytics could not be found."
              : `Unable to load analytics (HTTP ${response.status}).`
          );
        }

        const json = await response.json();

        if (!active) return;

        setData({
          ...json,
          total_scans: Number(json.total_scans) || 0,
          today_scans: Number(json.today_scans) || 0,
          last_7_days: Number(json.last_7_days) || 0,
          daily_counts: Array.isArray(json.daily_counts)
            ? json.daily_counts.map((item) => Number(item) || 0)
            : [],
          device_breakdown:
            json.device_breakdown &&
            typeof json.device_breakdown === "object"
              ? json.device_breakdown
              : {},
          recent_scans: Array.isArray(json.recent_scans)
            ? json.recent_scans
            : [],
        });

        setApiOffline?.(false);
        setApiBackendError?.(false);
      } catch (err) {
        if (!active || err?.name === "AbortError") return;

        console.error("Scan analytics fetch error:", err);

        const message = String(err?.message || "");
        const isNetworkError =
          /network|failed to fetch|timeout|timed out|load failed/i.test(
            message
          );

        if (isNetworkError) {
          setApiOffline?.(true);
        }

        setError(
          message || "Something went wrong while loading scan analytics."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    if (!slug) {
      setData(null);
      setError("A business identifier is missing from this page URL.");
      setLoading(false);
      return () => {
        active = false;
        controller.abort();
      };
    }

    fetchScans();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    token,
    slug,
    refreshKey,
    setApiOffline,
    setApiBackendError,
  ]);

  const dailyCounts = useMemo(() => {
    const counts = data?.daily_counts || [];

    // The chart represents the last seven days.
    // Pad shorter arrays so the layout remains consistent.
    return Array.from({ length: 7 }, (_, index) => {
      const offset = index - (7 - counts.length);
      return offset >= 0 ? counts[offset] || 0 : 0;
    });
  }, [data]);

  const maxDailyCount = Math.max(...dailyCounts, 1);

  const metrics = data
    ? [
        {
          label: "Total scans",
          value: data.total_scans,
          description: "All recorded QR scans",
          icon: QrCode,
        },
        {
          label: "Scans today",
          value: data.today_scans,
          description: "Activity so far today",
          icon: Activity,
        },
        {
          label: "Last 7 days",
          value: data.last_7_days,
          description: "Scans over the past week",
          icon: CalendarDays,
        },
        {
          label: "Device types",
          value: Object.keys(data.device_breakdown).length,
          description: "Device categories recorded",
          icon: Smartphone,
        },
      ]
    : [];

  if (loading) {
    return (
      <>
        <PageHeader businessName="QR Analytics" title="Scan activity" />
        <div className="min-h-screen bg-gray-50">
          <LoadingState />
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader businessName="QR Analytics" title="Scan activity" />

        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertCircle size={26} />
          </div>

          <h2 className="mt-5 text-xl font-semibold tracking-tight text-gray-900">
            Couldn't load analytics
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "Please try again in a moment."}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 text-gray-900">
      <PageHeader
        businessName={data.business || "QR Analytics"}
        title="Scan activity"
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Page title and actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Analytics overview
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              QR scan analytics
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Understand how customers interact with your QR code and when
              scans happen.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:self-auto"
          >
            <RefreshCw size={15} />
            Refresh data
          </button>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              {...metric}
              index={index}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <SectionCard
              title="Scan activity"
              description="Daily QR scans over the last seven days"
              icon={TrendingUp}
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  <Activity size={13} />
                  7 days
                </span>
              }
            >
              {dailyCounts.every((count) => count === 0) ? (
                <EmptyState
                  icon={TrendingUp}
                  title="No recent scan activity"
                  description="Your daily scan trend will appear here once customers start scanning your QR code."
                />
              ) : (
                <div>
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Scans this week
                      </p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
                        {formatNumber(dailyCounts.reduce((sum, n) => sum + n, 0))}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400">
                      Daily totals
                    </p>
                  </div>

                  <div className="relative">
                    {/* Chart grid lines */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
                      {[0, 1, 2, 3].map((line) => (
                        <div
                          key={line}
                          className="border-t border-dashed border-gray-200"
                        />
                      ))}
                    </div>

                    <div className="relative grid h-52 grid-cols-7 items-end gap-2 sm:gap-4">
                      {dailyCounts.map((count, index) => {
                        const date = new Date();
                        date.setHours(12, 0, 0, 0);
                        date.setDate(date.getDate() - (6 - index));

                        const dayLabel = date.toLocaleDateString("en-US", {
                          weekday: "short",
                        });

                        const height =
                          count === 0
                            ? 3
                            : Math.max((count / maxDailyCount) * 145, 8);

                        return (
                          <div
                            key={`${date.toISOString().slice(0, 10)}-${index}`}
                            className="group relative flex h-full min-w-0 flex-col items-center justify-end"
                          >
                            <div className="pointer-events-none absolute bottom-[calc(100%-1.5rem)] z-10 mb-1 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                              : {count} scans
                            </div>

                            <span className="mb-2 text-[10px] font-semibold text-gray-500 sm:text-xs">
                              {count > 0 ? formatNumber(count) : ""}
                            </span>

                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height }}
                              transition={{
                                duration: 0.55,
                                delay: index * 0.05,
                                ease: "easeOut",
                              }}
                              className={`relative w-full max-w-12 rounded-t-lg transition-colors ${
                                count > 0
                                  ? "bg-indigo-500 group-hover:bg-indigo-600"
                                  : "bg-gray-200"
                              }`}
                              style={{ minHeight: 3 }}
                              aria-label={`${dayLabel}: ${count} scans`}
                            />

                            <span className="mt-3 pb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                              {dayLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Device breakdown */}
          <div className="xl:col-span-2">
            <SectionCard
              title="Device breakdown"
              description="Devices used to scan your QR code"
              icon={Smartphone}
            >
              {Object.keys(data.device_breakdown).length === 0 ? (
                <EmptyState
                  icon={Smartphone}
                  title="No device data yet"
                  description="Device information will appear here when scans are recorded."
                />
              ) : (
                <div className="space-y-5">
                  {Object.entries(data.device_breakdown)
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([device, rawCount]) => {
                      const count = Number(rawCount) || 0;
                      const total = Object.values(data.device_breakdown).reduce(
                        (sum, value) => sum + (Number(value) || 0),
                        0
                      );
                      const percentage =
                        total > 0 ? Math.round((count / total) * 100) : 0;

                      const DeviceIcon = getDeviceIcon(device);

                      return (
                        <div key={device}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 ring-1 ring-gray-200/80">
                                <DeviceIcon size={17} />
                              </div>
                              <span className="truncate text-sm font-medium text-gray-700">
                                {getDeviceLabel(device)}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatNumber(count)}
                              </span>
                              <span className="w-10 text-right text-xs text-gray-400">
                                {percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-indigo-500"
                            />
                          </div>
                        </div>
                      );
                    })}

                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-3.5">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <p className="text-xs leading-5 text-gray-500">
                      Device percentages are calculated from the device
                      categories returned by your analytics API.
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Recent scans */}
        <div className="mt-6">
          <SectionCard
            title="Recent scans"
            description="The latest recorded QR scan events"
            icon={Clock3}
            action={
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {formatNumber(data.recent_scans.length)} shown
              </span>
            }
          >
            {data.recent_scans.length === 0 ? (
              <EmptyState
                icon={QrCode}
                title="No scans recorded yet"
                description="Share your QR code with customers. New scan events will show up here."
              />
            ) : (
              <>
                {/* Mobile-friendly scan cards */}
                <div className="space-y-3 md:hidden">
                  {data.recent_scans.map((scan, index) => {
                    const DeviceIcon = getDeviceIcon(scan.device_type);

                    return (
                      <motion.div
                        key={scan.id ?? scan.scanned_at ?? index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.04, 0.3) }}
                        className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-600 ring-1 ring-gray-200">
                            <DeviceIcon size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {getDeviceLabel(scan.device_type)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(scan.scanned_at)}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200">
                          Scan #{index + 1}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <th className="pb-3 pr-4 font-medium">Device</th>
                        <th className="pb-3 pr-4 font-medium">Device type</th>
                        <th className="pb-3 text-right font-medium">
                          Scanned at
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {data.recent_scans.map((scan, index) => {
                        const DeviceIcon = getDeviceIcon(scan.device_type);

                        return (
                          <tr
                            key={scan.id ?? scan.scanned_at ?? index}
                            className="transition hover:bg-gray-50/80"
                          >
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 ring-1 ring-gray-200/80">
                                  <DeviceIcon size={17} />
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                  {getDeviceLabel(scan.device_type)}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 pr-4">
                              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                {scan.device_type || "Unknown"}
                              </span>
                            </td>

                            <td className="py-4 text-right text-sm text-gray-500">
                              {formatDate(scan.scanned_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </SectionCard>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col gap-2 border-t border-gray-200/80 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>QR scan analytics</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Analytics data loaded
          </p>
        </div>
      </main>
    </div>
  );
}

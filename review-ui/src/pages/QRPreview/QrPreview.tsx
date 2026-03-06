import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";


export default function QRPreview() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);
  
  useEffect(() => {
    async function fetchScans() {
      try {


        const response = await fetch(
          `https://reviewqrapi.onrender.com/api/business/${slug}/analytics/summary/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Scan analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchScans();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading scan analytics…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load scan analytics.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

      {/* MOBILE + DESKTOP PREMIUM HEADER */}
      <PageHeader businessName={data.business} title="All Scans" />

      {/* CONTENT WRAPPER — mobile-safe, desktop-wide */}
      <div className="px-4 pt-4 w-full max-w-xl md:max-w-4xl mx-auto flex flex-col gap-8">

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
          {[
            { label: "Total Scans", value: data.total_scans },
            { label: "Today", value: data.today_scans },
            { label: "Last 7 Days", value: data.last_7_days },
            { label: "Unique Devices", value: Object.keys(data.device_breakdown).length },
          ].map((item, i) => (
            <div
              key={i}
              className="
                p-5 rounded-2xl bg-white/90 backdrop-blur-xl
                border border-gray-200 shadow-sm
                hover:shadow-md hover:-translate-y-[2px]
                transition-all duration-300 animate-fadeInUp
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* CHART — premium mobile + desktop-safe */}
        <div
          className="
            bg-white/90 backdrop-blur-xl
            p-5 md:p-6 rounded-3xl shadow-sm border border-gray-200
            animate-fadeInUp
          "
        >
          <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-4">
            Last 7 Days Trend
          </h2>

          {data.last_7_days === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm md:text-base">
              No scan activity yet.
            </p>
          ) : (
            <div className="relative w-full h-44 md:h-40 flex items-end gap-4 md:gap-3">

              {/* Background grid */}
              <div className="absolute inset-0 pointer-events-none grid grid-rows-4 opacity-20 md:opacity-10">
                <div className="border-b border-gray-200"></div>
                <div className="border-b border-gray-200"></div>
                <div className="border-b border-gray-200"></div>
                <div></div>
              </div>

              {data.daily_counts?.map((count, i) => {
                const day = new Date();
                day.setDate(day.getDate() - (6 - i));

                const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
                const fullDay = day.toLocaleDateString("en-US", { weekday: "long" });

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    {/* Tooltip */}
                    <div
                      className="
                        absolute -top-12 px-3 py-1.5 rounded-lg text-xs font-semibold
                        text-white bg-gray-900 shadow-lg whitespace-nowrap
                        opacity-0 group-hover:opacity-100 transition-all duration-200
                        scale-95 group-hover:scale-100
                      "
                    >
                      {fullDay}: {count} scans
                    </div>

                    {/* BAR */}
                    <div
                      className="
                        w-full rounded-md bg-indigo-500
                        shadow-sm shadow-indigo-200
                        transition-all duration-500 group-hover:scale-[1.08]
                        relative
                      "
                      style={{
                        height: `${Math.max(count * 14, 10)}px`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    >
                      {/* NUMBER ON BAR (mobile only) */}
                      <span
                        className="
                          absolute -top-5 left-1/2 -translate-x-1/2
                          text-[11px] font-semibold text-gray-700
                          md:hidden
                        "
                      >
                        {count}
                      </span>
                    </div>

                    {/* Day label */}
                    <p className="text-[11px] md:text-xs text-gray-600 mt-2 font-medium">
                      {dayLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DEVICE BREAKDOWN */}
        <div
          className="
            bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-200
            animate-fadeInUp
          "
        >
          <h2 className="text-lg font-bold mb-4">Device Breakdown</h2>

          {Object.keys(data.device_breakdown).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No device data yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:flex md:justify-around text-center gap-6">
              {Object.entries(data.device_breakdown).map(([device, count]) => (
                <div key={device} className="flex flex-col items-center">
                  <div
                    className="
                      w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center
                      text-gray-700 font-bold text-xl shadow-inner
                    "
                  >
                    {count}
                  </div>
                  <p className="mt-2 text-gray-700 font-medium capitalize">{device}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT SCANS */}
        <div
          className="
            bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-200
            animate-fadeInUp
          "
        >
          <h2 className="text-lg font-bold mb-4">Recent Scans</h2>

          {data.recent_scans.length === 0 ? (
            <div
              className="
                p-5 bg-yellow-50 border border-yellow-300 text-yellow-800
                rounded-xl shadow-sm animate-fadeIn text-center font-medium
              "
            >
              No scans recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {data.recent_scans.map((scan, i) => {
                const date = new Date(scan.scanned_at);
                const relative = date.toLocaleString();

                return (
                  <div
                    key={i}
                    className="
                      p-5 rounded-xl bg-white border border-gray-200 shadow-sm
                      hover:shadow-md hover:-translate-y-[2px]
                      transition-all duration-300 animate-fadeInUp
                      flex items-center justify-between
                    "
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner
                          ${scan.device_type === 'mobile'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                          }
                        `}
                      >
                        {scan.device_type === "mobile" ? "📱" : "💻"}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {scan.device_type === "mobile" ? "Mobile Device" : "Desktop Device"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{relative}</p>
                        {scan.ip_address && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            IP: {scan.ip_address}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`
                        text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap
                        ${scan.device_type === "mobile"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                        }
                      `}
                    >
                      {scan.device_type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
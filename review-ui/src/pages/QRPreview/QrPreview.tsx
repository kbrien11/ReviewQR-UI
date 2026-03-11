import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import { fetchWithTimeout } from "../../utils/FetchWithTimer";


export default function QRPreview() {
  const { token, setApiOffline, setApiBackendError } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();



  useEffect(() => {
    async function fetchScans() {
      try {
        const response = await fetchWithTimeout(
          `https://reviewqrapi.onrender.com/api/business/${slug}/analytics/summary/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔥 Backend reachable but failing
        if (!response.ok) {
          if ([401, 403, 500, 503].includes(response.status)) {
            setApiBackendError(true); // server issue
          }
          throw new Error("API error");
        }

        const json = await response.json();
        setData(json);

      } catch (err: any) {
        console.error("Scan analytics fetch error:", err);

        // 🔥 Network unreachable / CORS / timeout
        if (
          err.message.includes("Network") ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("timeout")
        ) {
          setApiOffline(true); // network issue
        }

      } finally {
        setLoading(false);
      }
    }

    fetchScans();
  }, [token, slug]);

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

  const metrics = [
    { label: "Total Scans", value: data.total_scans, icon: "📈" },
    { label: "Today", value: data.today_scans, icon: "☀️" },
    { label: "Last 7 Days", value: data.last_7_days, icon: "📅" },
    { label: "Unique Devices", value: Object.keys(data.device_breakdown).length, icon: "📱" },
  ];



  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] pb-24 overflow-x-hidden">

      {/* MOBILE + DESKTOP PREMIUM HEADER */}
      <PageHeader businessName={data.business} title="All Scans" />

      {/* CONTENT WRAPPER — mobile-safe, desktop-wide */}
      <div className="px-4 pt-4 w-full max-w-xl md:max-w-4xl mx-auto flex flex-col gap-8">

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
          {metrics.map((item, i) => (
            <div
              key={i}
              className="
        relative overflow-hidden
        p-5 rounded-[32px]
        bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,255,255,0.55))]
        backdrop-blur-2xl
        border border-white/40
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        transition-all duration-300
        active:scale-[.97]
        animate-fadeInUp
        md:bg-white md:border-gray-200 md:shadow-sm
      "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Inner highlight */}
              <div className="absolute inset-0 pointer-events-none 
        bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_60%)]
      " />

              {/* Icon badge */}
              <div className="
        w-10 h-10 rounded-2xl
        bg-white/60 backdrop-blur-xl
        flex items-center justify-center
        text-gray-700 text-xl font-semibold
        shadow-[0_2px_6px_rgba(0,0,0,0.08)]
        mb-3
      ">
                {item.icon}
              </div>

              {/* Label */}
              <p className="text-[0.75rem] text-gray-600 font-medium tracking-tight">
                {item.label}
              </p>

              {/* Value */}
              <p className="text-[2.2rem] font-semibold text-gray-900 tracking-tight leading-none mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        {/* FINANCE‑STYLE BAR CHART */}
        <div
          className="
            bg-white/60 backdrop-blur-3xl
            border border-white/50
            rounded-[26px]
            shadow-[0_6px_28px_rgba(0,0,0,0.05)]
            p-5 md:p-6 animate-fadeInUp
  
            md:bg-white md:backdrop-blur-none
            md:border md:border-gray-200
            md:shadow-sm md:rounded-2xl
          "
        >
          <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-4 tracking-tight">
            Last 7 Days Trend
          </h2>

          {data.last_7_days === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm md:text-base">
              No scan activity yet.
            </p>
          ) : (
            <div className="relative w-full h-48 md:h-44 flex items-end gap-4 md:gap-5">

              {/* GRID */}
              <div className="absolute inset-0 pointer-events-none grid grid-rows-4 opacity-[0.10]">
                <div className="border-b border-gray-300/50"></div>
                <div className="border-b border-gray-300/50"></div>
                <div className="border-b border-gray-300/50"></div>
                <div></div>
              </div>

              {data.daily_counts.map((count, i) => {
                const day = new Date();
                day.setDate(day.getDate() - (6 - i));

                const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
                const fullDay = day.toLocaleDateString("en-US", { weekday: "long" });

                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative">

                    {/* DESKTOP TOOLTIP */}
                    <div
                      className="
                        hidden md:block
                        absolute -top-12 px-3 py-1.5 rounded-xl text-xs font-semibold
                        text-gray-900 bg-white/95 backdrop-blur-xl
                        border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                        whitespace-nowrap
                        opacity-0 group-hover:opacity-100
                        scale-95 group-hover:scale-100
                        transition-all duration-200
                      "
                    >
                      {fullDay}: {count} scans
                    </div>

                    {/* BAR */}
                    <div
                      className="
                        w-full rounded-xl
                        bg-gradient-to-t from-indigo-600 to-indigo-400
                        shadow-[0_4px_12px_rgba(99,102,241,0.25)]
                        transition-all duration-500 group-hover:scale-[1.05]
                        relative
                      "
                      style={{
                        height: `${Math.max(count * 14, 10)}px`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    >
                      {/* MOBILE NUMBER */}
                      <span
                        className="
                          md:hidden
                          absolute -top-5 left-1/2 -translate-x-1/2
                          text-[12px] font-semibold text-gray-800
                          bg-white/90 backdrop-blur-xl
                          px-1.5 py-[1px] rounded-md shadow-sm
                        "
                      >
                        {count}
                      </span>
                    </div>

                    {/* DAY LABEL */}
                    <p className="text-[11px] md:text-xs text-gray-600 mt-2 font-medium tracking-tight">
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
            bg-white/60 backdrop-blur-3xl
            border border-white/50
            rounded-[26px]
            shadow-[0_6px_28px_rgba(0,0,0,0.05)]
            p-6 animate-fadeInUp
  
            md:bg-white md:backdrop-blur-none
            md:border md:border-gray-200
            md:shadow-sm md:rounded-2xl
          "
        >
          <h2 className="text-lg font-bold mb-4 tracking-tight">Device Breakdown</h2>

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
    bg-white/60 backdrop-blur-3xl
    border border-white/40
    rounded-[30px]
    shadow-[0_8px_32px_rgba(0,0,0,0.06)]
    p-6 animate-fadeInUp
    md:bg-white md:border-gray-200 md:shadow-sm md:rounded-2xl
  "
        >
          <h2 className="text-lg font-bold mb-5 tracking-tight">Recent Scans</h2>

          {data.recent_scans.length === 0 ? (
            <div className="
      p-5 bg-yellow-50 border border-yellow-300 text-yellow-800
      rounded-xl shadow-sm animate-fadeIn text-center font-medium
    ">
              No scans recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent_scans.map((scan, i) => {
                const date = new Date(scan.scanned_at).toLocaleString();
                const isMobile = scan.device_type === "mobile";

                return (
                  <div
                    key={i}
                    className="
              relative overflow-hidden
              p-4 rounded-[26px]
              bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,255,255,0.55))]
              backdrop-blur-xl
              border border-white/40
              shadow-[0_4px_18px_rgba(0,0,0,0.04)]
              transition-all duration-300
              active:scale-[.97]
              flex items-center justify-between
              animate-fadeInUp
            "
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {/* Ambient glow */}
                    <div className="
              absolute inset-0 pointer-events-none
              bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_70%)]
            " />

                    {/* Left side */}
                    <div className="flex items-center gap-4 relative z-10">
                      {/* Icon bubble */}
                      <div
                        className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
                  shadow-[0_2px_6px_rgba(0,0,0,0.08)]
                  backdrop-blur-xl
                  ${isMobile ? "bg-blue-100/70 text-blue-600" : "bg-purple-100/70 text-purple-600"}
                `}
                      >
                        {isMobile ? "📱" : "💻"}
                      </div>

                      {/* Text */}
                      <div>
                        <p className="font-semibold text-gray-900 tracking-tight">
                          {isMobile ? "Mobile Device" : "Desktop Device"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">{date}</p>

                        
                      </div>
                    </div>

                    {/* Device tag */}
                    <span
                      className={`
                text-[11px] px-3 py-1 rounded-full font-semibold whitespace-nowrap
                shadow-sm backdrop-blur-xl
                ${isMobile ? "bg-blue-100/70 text-blue-700" : "bg-purple-100/70 text-purple-700"}
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
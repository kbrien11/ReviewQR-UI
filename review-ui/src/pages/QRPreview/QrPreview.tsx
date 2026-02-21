import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export default function QRPreview() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
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
    <div className="min-h-screen bg-gray-50 pb-10">
  
      {/* HEADER — matches Reviews page */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-xl rounded-b-3xl animate-fadeIn">
        <div className="flex justify-between items-center">
  
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
  
          <h1 className="text-3xl font-extrabold tracking-tight">{data.business} Scans</h1>
  
          <Link
            to="/"
            className="text-white/80 hover:text-white hover:scale-105 transition-all font-semibold"
          >
            ReviewQR
          </Link>
        </div>
  
        <p className="mt-2 text-slate-300">QR Scan Performance Overview</p>
      </div>
  
      {/* CONTENT */}
      <div className="p-5 max-w-4xl mx-auto">
  
        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {[
            { label: "Total Scans", value: data.total_scans, color: "from-blue-500 to-blue-600" },
            { label: "Today", value: data.today_scans, color: "from-green-500 to-green-600" },
            { label: "Last 7 Days", value: data.last_7_days, color: "from-purple-500 to-purple-600" },
            { label: "Unique Devices", value: Object.keys(data.device_breakdown).length, color: "from-orange-500 to-orange-600" },
          ].map((item, i) => (
            <div
              key={i}
              className="
                p-5 rounded-2xl bg-white shadow-md border border-gray-100 relative overflow-hidden
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                animate-fadeInUp
              "
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}></div>
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
  {/* MINI SPARKLINE CHART */}
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-8 animate-fadeInUp">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">Last 7 Days Trend</h2>
  </div>

  {data.last_7_days === 0 ? (
    <p className="text-gray-500 text-center py-4">No scan activity yet.</p>
  ) : (
    <div className="relative w-full h-36 flex items-end gap-3">

      {data.daily_counts?.map((count: number, i: number) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - i)); // oldest → newest

        const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.
        const fullDay = day.toLocaleDateString("en-US", { weekday: "long" });   // "Monday"

        return (
          <div key={i} className="flex-1 flex flex-col items-center group relative">

            {/* Tooltip */}
            <div className="
              absolute -top-10 px-3 py-1 rounded-md text-xs font-semibold text-white bg-gray-900 
              opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none
              shadow-lg whitespace-nowrap
            ">
              {fullDay}: {count} scans
            </div>

            {/* Bar */}
            <div
              className="
                w-full rounded-md bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm 
                transition-all duration-500 group-hover:scale-105
              "
              style={{
                height: `${Math.max(count * 12, 8)}px`,
                animationDelay: `${i * 120}ms`,
              }}
            ></div>

            {/* Day label */}
            <p className="text-xs text-gray-500 mt-2">{dayLabel}</p>
          </div>
        );
      })}
    </div>
  )}
</div>
  
        {/* DEVICE BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-8 animate-fadeInUp">
          <h2 className="text-lg font-bold mb-4">Device Breakdown</h2>
  
          {Object.keys(data.device_breakdown).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No device data yet.</p>
          ) : (
            <div className="flex justify-around text-center">
              {Object.entries(data.device_breakdown).map(([device, count]) => (
                <div key={device} className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-inner">
                    {count}
                  </div>
                  <p className="mt-2 text-gray-700 font-medium capitalize">{device}</p>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* RECENT SCANS */}
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-8 animate-fadeInUp">
  <h2 className="text-lg font-bold mb-4">Recent Scans</h2>

  {data.recent_scans.length === 0 ? (
    <div className="p-5 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl shadow-sm animate-fadeIn text-center font-medium">
      No scans recorded yet.
    </div>
  ) : (
    <div className="space-y-4">
      {data.recent_scans.map((scan: any, i: number) => {
        const date = new Date(scan.scanned_at);
        const relative = date.toLocaleString(); // You can replace with a "time ago" util later

        return (
          <div
            key={i}
            className="
              p-5 rounded-xl bg-white border border-gray-100 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300
              animate-slideIn flex items-center justify-between
            "
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              {/* Device Icon */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner
                  ${
                    scan.device_type === 'mobile'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }
                `}
              >
                {scan.device_type === "mobile" ? "📱" : "💻"}
              </div>

              {/* Scan Info */}
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {scan.device_type === "mobile" ? "Mobile Device" : "Desktop Device"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {relative}
                </p>

                {/* Optional IP address preview */}
                {scan.ip_address && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    IP: {scan.ip_address}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE BADGE */}
            <span
              className={`
                text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap
                ${
                  scan.device_type === "mobile"
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
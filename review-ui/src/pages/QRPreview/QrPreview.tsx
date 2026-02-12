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

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">{data.business}</h1>

          <Link
            to="/dashboard"
            className="text-white/90 font-semibold hover:text-white hover:scale-105 transition-all"
          >
            ← Back
          </Link>
        </div>

        <p className="mt-2 text-blue-100">QR Scan Performance Overview</p>
      </div>

      <div className="p-5">

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Scans", value: data.total_scans, color: "from-blue-500 to-blue-600" },
            { label: "Today", value: data.today_scans, color: "from-green-500 to-green-600" },
            { label: "Last 7 Days", value: data.last_7_days, color: "from-purple-500 to-purple-600" },
            { label: "Unique Devices", value: Object.keys(data.device_breakdown).length, color: "from-orange-500 to-orange-600" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl shadow-md bg-white relative overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.color}`}></div>
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* DEVICE BREAKDOWN */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8 animate-fadeInUp">
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
        <div className="bg-white p-6 rounded-xl shadow-md mt-8 animate-fadeInUp">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Scans</h2>
          </div>

          {data.recent_scans.length === 0 ? (
            <div className="p-5 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl shadow-sm animate-fadeIn text-center font-medium">
              No scans recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {data.recent_scans.map((scan: any, i: number) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl hover:bg-gray-50 transition-all duration-200 animate-slideIn"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold text-gray-800 capitalize">{scan.device_type}</p>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(scan.scanned_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
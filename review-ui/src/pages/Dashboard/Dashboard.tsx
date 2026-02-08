import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard/summary/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ANALYTICS HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-xl rounded-b-3xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {data.business_name} Analytics
          </h1>

          <Link
            to="/"
            className="text-white/80 hover:text-white hover:scale-105 transition-all font-semibold"
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-2 text-slate-300">{data.status_message}</p>
      </div>

      {/* MAIN GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* KPI CARDS */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reviews", value: data.total_reviews, color: "bg-blue-600" },
            { label: "Avg Rating", value: data.avg_rating, color: "bg-yellow-500" },
            { label: "Last 7 Days", value: data.last_7_days, color: "bg-green-600" },
            { label: "Public Reviews", value: data.public_reviews, color: "bg-purple-600" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl shadow-lg text-white ${item.color} animate-fadeInUp`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-3xl font-extrabold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* DEVICE BREAKDOWN */}
        <div className="bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Device Breakdown</h2>

            <Link
              to="/scans"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[.98] transition-all duration-200"
            >
              View More →
            </Link>
          </div>

          <div className="flex justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {data.device_breakdown.mobile || 0}
              </p>
              <p className="text-gray-600">Mobile</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-purple-600">
                {data.device_breakdown.desktop || 0}
              </p>
              <p className="text-gray-600">Desktop</p>
            </div>
          </div>
        </div>

        {/* SENTIMENT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
          <h2 className="text-lg font-bold mb-4">Sentiment Overview</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Positive</span>
              <span className="font-bold text-green-600">
                {Math.round((data.public_reviews / data.total_reviews) * 100) || 0}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-700">Private Feedback</span>
              <span className="font-bold text-red-600">
                {Math.round((data.private_reviews / data.total_reviews) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* LATEST REVIEWS */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Latest Reviews</h2>

            <Link
              to="/reviews"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:scale-105 transition-all"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {data.latest_reviews.map((review: any, i: number) => (
              <div
                key={review.id}
                className="p-4 border rounded-xl hover:bg-gray-50 transition-all duration-200 animate-slideIn"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-gray-800">⭐ {review.rating}</p>
                  <p className="text-sm text-gray-500">{review.device_type}</p>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
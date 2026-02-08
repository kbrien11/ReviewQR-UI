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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-b-3xl shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">{data.business_name}</h1>

          <Link
            to="/"
            className="text-white/90 font-semibold hover:text-white hover:scale-105 transition-all"
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-2 text-blue-100">{data.status_message}</p>
      </div>

      <div className="p-5">

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Reviews", value: data.total_reviews, color: "from-blue-500 to-blue-600" },
            { label: "Avg Rating", value: data.avg_rating, color: "from-yellow-400 to-yellow-500" },
            { label: "Last 7 Days", value: data.last_7_days, color: "from-green-500 to-green-600" },
            { label: "Public Reviews", value: data.public_reviews, color: "from-purple-500 to-purple-600" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-md bg-white relative overflow-hidden animate-fadeInUp`}
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

          <div className="flex justify-around text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-inner">
                {data.device_breakdown.mobile}
              </div>
              <p className="mt-2 text-gray-700 font-medium">Mobile</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner">
                {data.device_breakdown.desktop}
              </div>
              <p className="mt-2 text-gray-700 font-medium">Desktop</p>
            </div>
          </div>
        </div>

        {/* LATEST REVIEWS */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8 animate-fadeInUp">
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
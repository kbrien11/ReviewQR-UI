import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Reviews() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReviews();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, filter]);

  async function fetchReviews() {
    try {
      const params = new URLSearchParams();

      if (search) params.append("q", search);
      if (filter === "public") params.append("public", "true");
      if (filter === "private") params.append("public", "false");
      if (filter === "mobile") params.append("device", "mobile");
      if (filter === "desktop") params.append("device", "desktop");

      const response = await fetch(
        `https://reviewqrapi.onrender.com/api/reviews/search/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await response.json();

      if (json.count === 0) {
        setReviews([]);
        setStatusMessage(json.status_message);
      } else {
        setReviews(json.results);
        setStatusMessage(json.status_message);
      }
    } catch (err) {
      console.error("Review search error:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      String(r.rating).includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "public" && r.is_public) ||
      (filter === "private" && !r.is_public) ||
      (filter === "mobile" && r.device_type === "mobile") ||
      (filter === "desktop" && r.device_type === "desktop");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading reviews…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* MATCHING ANALYTICS HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-xl rounded-b-3xl">

        <div className="flex justify-between items-center">

          {/* Back Button + Title */}
          <div className="flex items-center gap-4">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight">
              All Reviews
            </h1>
          </div>

          {/* ReviewQR Link */}
          <Link
            to="/"
            className="text-white/80 hover:text-white hover:scale-105 transition-all font-semibold"
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-2 text-slate-300">{statusMessage}</p>
      </div>

      

      {/* PAGE CONTENT */}
      <div className="p-5">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search reviews…"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {[
            { key: "all", label: "All" },
            { key: "public", label: "Public" },
            { key: "private", label: "Private" },
            { key: "mobile", label: "Mobile" },
            { key: "desktop", label: "Desktop" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                filter === f.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Review List */}
        <div className="space-y-5">

          {filteredReviews.length === 0 && (
            <div className="p-5 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl shadow-sm animate-fadeIn text-center font-medium">
              No reviews found for this criteria.
            </div>
          )}

          {filteredReviews.map((review, i) => (
            <div
              key={review.id}
              className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slideIn"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-bold text-yellow-500">⭐ {review.rating}</p>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    review.device_type === "mobile"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {review.device_type}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              <p className="text-xs text-gray-400 mt-3">
                {new Date(review.created_at).toLocaleString()}
              </p>

              {review.is_public ? (
                <span className="inline-block mt-3 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Public Review
                </span>
              ) : (
                <span className="inline-block mt-3 text-xs font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  Private Feedback
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Reviews() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/reviews/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();
        setReviews(json.results);
      } catch (err) {
        console.error("Review fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [token]);

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

      {/* Sticky Header */}
      <div className="sticky top-0 bg-white shadow-md p-5 z-50 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-800">All Reviews</h1>

        <Link
          to="/dashboard"
          className="text-blue-600 font-semibold hover:text-blue-800 hover:scale-105 transition-all"
        >
          ← Back
        </Link>
      </div>

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

             {/* No Results Alert */}
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
              {/* Rating + Device */}
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

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(review.created_at).toLocaleString()}
              </p>

              {/* Public/Private Badge */}
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
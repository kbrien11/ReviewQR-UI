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

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "Unknown date";

    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "Unknown date";

    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* LINEAR-STYLE HEADER */}
      <div className="
        bg-white border-b border-gray-200
        px-6 py-8 shadow-sm
        animate-fadeInUp
      ">
        <div className="flex justify-between items-center">

          {/* Back Button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="
                p-2 rounded-lg bg-gray-100 hover:bg-gray-200
                transition-all shadow-sm hover:shadow-md
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              All Reviews
            </h1>
          </div>

          {/* ReviewQR Link */}
          <Link
            to="/"
            className="
              text-gray-600 hover:text-gray-900
              font-semibold transition-all hover:scale-[1.03]
            "
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-2 text-gray-500">{statusMessage}</p>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-5 max-w-3xl mx-auto">

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search reviews…"
            className="
              w-full px-4 py-3 rounded-xl border border-gray-300
              bg-white shadow-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-all
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
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
              className={`
                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${filter === f.key
                  ? "bg-indigo-600 text-white shadow-md scale-[1.03]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Review List */}
        <div className="space-y-5">

          {filteredReviews.length === 0 && (
            <div className="
              p-5 bg-yellow-50 border border-yellow-300 text-yellow-800
              rounded-xl shadow-sm animate-fadeIn text-center font-medium
            ">
              No reviews found for this criteria.
            </div>
          )}

          {filteredReviews.map((review, i) => (
            <div
              key={review.id}
              className="
                p-5 bg-white rounded-2xl border border-gray-200
                shadow-sm hover:shadow-md
                transition-all duration-300 hover:-translate-y-[2px]
                animate-fadeInUp
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </p>

                <span
                  className={`
                    text-xs px-3 py-1 rounded-full font-medium
                    ${review.device_type === "mobile"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                    }
                  `}
                >
                  {review.device_type}
                </span>
              </div>

              <p className="text-gray-800 leading-relaxed text-[15px]">
                {review.comment}
              </p>

              <p className="text-xs text-gray-400 mt-3">
              {formatDate(review.created_at)}
              </p>

              {review.is_public ? (
                <span className="
                  inline-block mt-3 text-xs font-semibold text-green-700
                  bg-green-100 px-3 py-1 rounded-full
                ">
                  Public Review
                </span>
              ) : (
                <span className="
                  inline-block mt-3 text-xs font-semibold text-red-700
                  bg-red-100 px-3 py-1 rounded-full
                ">
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
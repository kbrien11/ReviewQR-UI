import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function formatDateTime(date) {
  if (!date) return "Date unavailable";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "Date unavailable";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs >= 0 && diffMinutes < 1) return "Just now";
  if (diffMs >= 0 && diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMs >= 0 && diffHours < 24) return `${diffHours}h ago`;
  if (diffMs >= 0 && diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function StarRating({ rating }) {
  const value = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
      title={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= value ? "currentColor" : "none"}
          className={`h-4 w-4 ${
            star <= value ? "text-amber-400" : "text-gray-200"
          }`}
          aria-hidden="true"
        >
          <path
            d="M10 1.8l2.5 5.1 5.6.8-4.05 3.95 0.96 5.58L10 14.6l-5.01 2.63.96-5.58L1.9 7.7l5.6-.8L10 1.8z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ isPublic }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isPublic
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15"
          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublic ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {isPublic ? "Public review" : "Private feedback"}
    </span>
  );
}

export default function LatestReview({ reviews = [] }) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm"
    >
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-indigo-100/60 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M7 3.75h7l4 4V20a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 20V5a1.25 1.25 0 0 1 1-1.25Z"
                  strokeLinejoin="round"
                />
                <path d="M14 4v4h4M9 12h6M9 16h6" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
              Latest Reviews
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            Stay on top of your latest customer feedback.
          </p>
        </div>

        <Link
          to="/reviews"
          className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          View all
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 10h12M10 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Review feed */}
      {safeReviews.length > 0 ? (
        <div className="relative divide-y divide-gray-100 px-5 sm:px-7">
          {safeReviews.slice(0, 5).map((review, index) => {
            const comment = String(review?.comment || "").trim();
            const reviewId = review?.id ?? `${review?.created_at || "review"}-${index}`;

            return (
              <motion.article
                key={reviewId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="group relative py-5"
              >
                <div className="flex items-start gap-3.5">
                  {/* Reviewer avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200/60">
                    {review?.reviewer_name
                      ? String(review.reviewer_name).trim().charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Reviewer and timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {review?.reviewer_name || "Customer"}
                      </p>
                      <time
                        dateTime={review?.created_at || undefined}
                        className="shrink-0 text-xs text-gray-400"
                      >
                        {formatDateTime(review?.created_at)}
                      </time>
                    </div>

                    {/* Rating */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <StarRating rating={review?.rating} />
                      <span className="text-xs font-medium text-gray-500">
                        {Math.min(
                          5,
                          Math.max(0, Math.round(Number(review?.rating) || 0))
                        )}/5
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                      {comment || "No written comment was provided."}
                    </p>

                    {/* Review status */}
                    <div className="mt-3">
                      <StatusBadge isPublic={Boolean(review?.is_public)} />
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-gradient-to-r from-indigo-300 via-violet-300 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </motion.article>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="relative flex flex-col items-center px-6 py-12 text-center sm:py-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M7 3.75h7l4 4V20a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 20V5a1.25 1.25 0 0 1 1-1.25Z"
                strokeLinejoin="round"
              />
              <path d="M14 4v4h4M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
          </div>

          <h3 className="mt-4 text-sm font-bold text-gray-900">
            Your reviews will show up here
          </h3>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-gray-500">
            Once customers leave feedback through your QR code, you can track it here.
          </p>

          <Link
            to="/reviews"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Explore reviews
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      {safeReviews.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-3.5 sm:px-7">
          <p className="text-xs text-gray-500">
            Showing {Math.min(safeReviews.length, 5)} of {safeReviews.length}{" "}
            {safeReviews.length === 1 ? "review" : "reviews"}
          </p>
          <Link
            to="/reviews"
            className="text-xs font-semibold text-gray-600 transition hover:text-indigo-600"
          >
            Manage feedback
          </Link>
        </div>
      )}
    </motion.section>
  );
}
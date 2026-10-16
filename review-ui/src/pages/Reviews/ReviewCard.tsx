import { motion, useReducedMotion } from "framer-motion";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
          className={`h-4 w-4 ${
            star <= value ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.1 5.6.8-4.05 3.95.96 5.58L10 14.6l-5.01 2.63.96-5.58L1.9 7.7l5.6-.8L10 1.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewCard({ review, onClick, delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  if (!review) return null;

  const isGoogleReview = String(review.source || "").toLowerCase() === "google";
  const rating = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)));
  const comment = String(review.comment || "").trim();
  const sourceLabel = isGoogleReview ? "Google" : "Internal";
  const reviewDate = formatDate(review.created_at);

  const handleCardClick = () => {
    onClick?.(review);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: prefersReducedMotion ? 0 : Math.max(0, Number(delay) || 0) / 1000,
        ease: "easeOut",
      }}
      whileHover={
        onClick && !prefersReducedMotion
          ? { y: -2, boxShadow: "0 12px 28px rgba(15, 23, 42, 0.07)" }
          : undefined
      }
      onClick={onClick ? handleCardClick : undefined}
      onKeyDown={onClick ? handleCardKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open review, ${rating} out of 5 stars` : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors duration-200 sm:p-6 ${
        onClick
          ? "cursor-pointer hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          : ""
      }`}
    >
      {/* Subtle hover accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-300 transition-transform duration-300 group-hover:scale-x-100" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={rating} />

            <span className="text-xs font-semibold text-gray-700">
              {rating}/5
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">{reviewDate}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isGoogleReview
                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10"
                : "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10"
            }`}
          >
            {isGoogleReview && (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.42 13.92a6 6 0 0 1 0-3.84v-2.6H3.07a10 10 0 0 0 0 9.04l3.35-2.6Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"
                />
              </svg>
            )}
            {sourceLabel}
          </span>
        </div>
      </div>

      {/* Review comment */}
      <div className="mt-5">
        <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700">
          {comment || "No written comment was provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span
            className={`h-2 w-2 rounded-full ${
              isGoogleReview ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          {isGoogleReview ? "Published on Google" : "Customer feedback"}
        </div>

        {isGoogleReview && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClick?.(review);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M17 9.5a6.5 6.5 0 0 1-6.5 6.5H5l-2.5 1.5V9.5A6.5 6.5 0 0 1 9 3h1.5A6.5 6.5 0 0 1 17 9.5Z"
                strokeLinejoin="round"
              />
              <path d="M6.5 9.5h5M6.5 12h3" strokeLinecap="round" />
            </svg>
            Reply
          </button>
        )}
      </div>
    </motion.article>
  );
}
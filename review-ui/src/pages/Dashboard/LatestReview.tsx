import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LatestReview({ reviews }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative p-6 rounded-3xl
        bg-white/80 dark:bg-gray-900/60
        backdrop-blur-2xl
        border border-gray-200/60 dark:border-gray-700/60
        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        overflow-hidden
      "
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-300/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
          Latest Reviews
        </h2>

        <Link
          to="/reviews"
          className="
            text-sm font-medium text-indigo-600 dark:text-indigo-400
            hover:opacity-80 transition
          "
        >
          View All →
        </Link>
      </div>

      {/* Feed */}
      <div className="space-y-4 relative z-10">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="
              group relative p-5 rounded-2xl
              bg-white/70 dark:bg-gray-900/50
              backdrop-blur-xl
              border border-gray-200/60 dark:border-gray-700/60
              shadow-sm
              transition-all
              hover:shadow-md hover:-translate-y-[2px]
            "
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-2">
              {/* Stars */}
              <div className="flex items-center gap-1 text-yellow-500 text-base">
                {"⭐".repeat(review.rating)}
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(review.created_at).toLocaleString()}
              </span>
            </div>

            {/* Comment */}
            <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed line-clamp-3">
              {review.comment}
            </p>

            {/* Tag */}
            <div className="mt-3">
              {review.is_public ? (
                <span
                  className="
                    text-xs font-medium
                    text-indigo-700 dark:text-indigo-300
                    bg-indigo-100 dark:bg-indigo-900/40
                    px-2.5 py-1 rounded-full
                  "
                >
                  Public Review
                </span>
              ) : (
                <span
                  className="
                    text-xs font-medium
                    text-orange-700 dark:text-orange-300
                    bg-orange-100 dark:bg-orange-900/40
                    px-2.5 py-1 rounded-full
                  "
                >
                  Private Feedback
                </span>
              )}
            </div>

            {/* Subtle bottom divider on hover */}
            <div
              className="
                absolute bottom-0 left-0 right-0 h-[2px]
                bg-gradient-to-r from-indigo-400/0 via-indigo-400/40 to-indigo-400/0
                opacity-0 group-hover:opacity-100
                transition-all duration-300
              "
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
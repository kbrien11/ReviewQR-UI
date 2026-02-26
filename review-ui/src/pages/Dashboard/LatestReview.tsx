import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LatestReview({ reviews }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative p-6 rounded-2xl
        bg-white
        border border-gray-200
        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Latest Reviews
        </h2>
  
        <Link
          to="/reviews"
          className="
            text-sm text-gray-600 hover:text-gray-900
            transition-all hover:scale-[1.03]
          "
        >
          View All →
        </Link>
      </div>
  
      {/* Feed */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="
              relative p-4 rounded-xl
              bg-white
              border border-gray-200
              shadow-sm
              hover:shadow-md hover:-translate-y-[2px]
              transition-all
            "
          >
            {/* Left neon accent */}
            <div
              className="
                absolute left-0 top-0 h-full w-[4px]
                bg-gradient-to-b from-indigo-500 to-purple-500
                rounded-l-xl
              "
            />
  
            {/* Top Row */}
            <div className="flex justify-between items-center text-sm mb-1">
              <div className="flex items-center gap-1 text-yellow-500 text-base">
                {"⭐".repeat(review.rating)}
              </div>
  
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleString()}
                </span>
              </div>
            </div>
  
            {/* Comment */}
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">
              {review.comment}
            </p>
  
            {/* Tag */}
            {review.is_public ? (
              <span className="
                text-xs font-medium
                text-indigo-700 bg-indigo-100
                px-2 py-1 rounded-full mt-2 inline-block
              ">
                Public Review
              </span>
            ) : (
              <span className="
                text-xs font-medium
                text-orange-700 bg-orange-100
                px-2 py-1 rounded-full mt-2 inline-block
              ">
                Private Feedback
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
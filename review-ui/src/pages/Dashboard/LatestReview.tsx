import { Link } from "react-router-dom";

export default function LatestReview({ reviews }: { reviews: any[] }) {
  return (
    <div className="
      bg-white p-4 md:p-6 rounded-xl
      border border-gray-200 shadow-sm
      animate-fadeInUp
    ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Latest Reviews</h2>
  
        <Link
          to="/reviews"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          View All →
        </Link>
      </div>
  
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="
              p-4 rounded-lg bg-white border border-gray-200 shadow-sm
              hover:shadow-md transition-all
              flex flex-col gap-2
            "
          >
            {/* Rating + Device */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-yellow-500 text-base">
                {"⭐".repeat(review.rating)}
              </div>
  
              <span className="
                text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700
              ">
                {review.device_type === "mobile" ? "Mobile" : "Desktop"}
              </span>
            </div>
  
            <p className="text-gray-800 text-sm leading-relaxed">
              {review.comment}
            </p>
  
            <p className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleString()}
            </p>
  
            {review.is_public ? (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                Public Review
              </span>
            ) : (
              <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                Private Feedback
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
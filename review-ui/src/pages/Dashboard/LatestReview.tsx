import { Link } from "react-router-dom";

export default function LatestReview({ reviews }: { reviews: any[] }) {
    return (
        <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-md border border-gray-100 animate-fadeInUp">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Latest Reviews</h2>
      
            <Link
              to="/reviews"
              className="text-blue-600 font-semibold hover:text-blue-800 hover:scale-105 transition-all"
            >
              View All →
            </Link>
          </div>
      
          <div className="space-y-5">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="
                  p-5 rounded-xl bg-white border border-gray-100 shadow-sm
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                  animate-slideIn flex flex-col gap-2
                "
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Rating + Device */}
                <div className="flex justify-between items-center">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-yellow-500 text-lg font-bold">
                    {"⭐".repeat(review.rating)}
                  </div>
      
                  {/* Device Badge */}
                  <span
                    className={`
                      text-xs px-3 py-1 rounded-full font-semibold
                      ${
                        review.device_type === "mobile"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }
                    `}
                  >
                    {review.device_type === "mobile" ? "📱 Mobile" : "💻 Desktop"}
                  </span>
                </div>
      
                {/* Comment */}
                <p className="text-gray-700 leading-relaxed text-[15px]">
                  {review.comment}
                </p>
      
                {/* Timestamp */}
                <p className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleString()}
                </p>
      
                {/* Public / Private */}
                {review.is_public ? (
                  <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full mt-1">
                    Public Review
                  </span>
                ) : (
                  <span className="inline-block text-xs font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full mt-1">
                    Private Feedback
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
}
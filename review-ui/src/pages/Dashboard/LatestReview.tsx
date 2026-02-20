import { Link } from "react-router-dom";

export default function LatestReview({ reviews }: { reviews: any[] }) {
  return (
    <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
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
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="p-4 border rounded-xl hover:bg-gray-50 transition-all duration-200 animate-slideIn"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex justify-between mb-1">
              <p className="font-semibold text-gray-800">⭐ {review.rating}</p>
              <p className="text-sm text-gray-500">
                {review.device_type === "mobile" ? "📱 Mobile" : "💻 Desktop"}
              </p>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
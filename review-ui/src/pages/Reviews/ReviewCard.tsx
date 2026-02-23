export default function ReviewCard({ review, onClick, delay }) {
    return (
        <div
            onClick={onClick}
            className="
          p-5 bg-white rounded-2xl border border-gray-200
          shadow-sm hover:shadow-md transition-all hover:-translate-y-[2px]
          cursor-pointer animate-fadeInUp
        "
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-yellow-500">
                    {"⭐".repeat(review.rating)}
                </p>

                <span className="
            text-xs px-3 py-1 rounded-full font-medium
            bg-gray-100 text-gray-700
          ">
                    {review.source === "google" ? "Google" : "Internal"}
                </span>
                {review.source === "google" && (
                    <span className="
    text-xs font-medium text-indigo-600
    bg-indigo-50 px-2 py-1 rounded-md
  ">
                        Reply
                    </span>
                )}
            </div>

            <p className="text-gray-800 leading-relaxed text-[15px]">
                {review.comment}
            </p>

            <p className="text-xs text-gray-400 mt-3">
                {new Date(review.created_at).toLocaleString()}
            </p>
        </div>
    );
}
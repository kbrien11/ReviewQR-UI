export default function ReviewCard({ review, onClick, delay }) {
    return (
        <div
            onClick={onClick}
            className="
            bg-white/90 backdrop-blur-xl
            rounded-2xl border border-gray-200
            shadow-sm active:scale-[.99]
            transition-all duration-200
            p-4 space-y-3 cursor-pointer
          "
          style={{ animationDelay: window.innerWidth < 640 ? "0ms" : `${delay}ms` }}
        >
            {/* Header Row */}
            <div className="flex items-center justify-between">

                {/* Rating */}
                <p className="text-base font-semibold text-yellow-500 leading-none">
                    {"⭐".repeat(review.rating)}
                </p>

                <div className="flex items-center gap-2">

                    {/* Source Badge */}
                    <span className="
                text-[11px] px-2.5 py-1 rounded-full font-medium
                bg-gray-100 text-gray-700
              ">
                        {review.source === "google" ? "Google" : "Internal"}
                    </span>

                    {/* Reply Badge */}
                    {review.source === "google" && (
                        <span className="
                  text-[11px] font-medium text-indigo-600
                  bg-indigo-50 px-2 py-1 rounded-md
                ">
                            Reply
                        </span>
                    )}
                </div>
            </div>

            {/* Comment */}
            <p className="text-gray-800 text-[15px] leading-relaxed">
                {review.comment}
            </p>

            {/* Timestamp */}
            <p className="text-[11px] text-gray-400">
                {new Date(review.created_at).toLocaleString()}
            </p>
        </div>
    );
}
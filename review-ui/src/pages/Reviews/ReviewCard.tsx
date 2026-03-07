export default function ReviewCard({ review, onClick, delay }) {
    return (
        <div
            className="
            bg-white/70 
                backdrop-blur-2xl
                rounded-3xl 
                border border-white/60 
                shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                active:scale-[.98]
                transition-all duration-300
                p-5 space-y-4
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
                    <span
                        className="
                  text-[11px] px-2.5 py-1 rounded-full font-medium
                  bg-gray-100 text-gray-700
                "
                    >
                        {review.source === "google" ? "Google" : "Internal"}
                    </span>

                    {/* Reply Badge — now the ONLY clickable element */}
                    {review.source === "google" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent bubbling
                                onClick?.(review);   // open drawer
                            }}
                            className="
                    text-[11px] font-medium text-indigo-600
                    bg-indigo-50 px-2 py-1 rounded-md
                    hover:bg-indigo-100 active:scale-[.97]
                    transition
                  "
                        >
                            Reply
                        </button>
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
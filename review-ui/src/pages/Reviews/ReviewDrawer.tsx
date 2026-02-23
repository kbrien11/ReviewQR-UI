export default function ReviewDrawer({ review, onClose }) {
    if (!review) return null;
  
    return (
        <div className="
          fixed right-0 top-0 h-full w-[420px]
          bg-white border-l border-gray-200
          shadow-xl flex flex-col
          animate-slideIn
        ">
          {/* HEADER */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Review Details
            </h2>
      
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
      
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      
            {/* AUTHOR + RATING */}
            <div>
              <p className="text-xl font-semibold text-gray-900">{review.author}</p>
      
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500 text-lg">
                  {"⭐".repeat(review.rating)}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  {review.rating}.0
                </span>
              </div>
      
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
      
            {/* COMMENT */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed text-[15px]">
                {review.comment}
              </p>
            </div>
      
            {/* SOURCE BADGE */}
            <div>
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-medium
                ${review.source === "google"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-100 text-gray-700"
                }
              `}>
                {review.source === "google" ? "Google Review" : "Internal Review"}
              </span>
            </div>
      
            {/* GOOGLE REPLY BOX */}
            {review.source === "google" && (
              <div className="pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700">
                  Public Reply
                </label>
      
                <textarea
                  placeholder="Write a public reply…"
                  className="
                    w-full mt-2 p-3 rounded-lg border border-gray-300
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    text-[15px] leading-relaxed
                  "
                  rows={4}
                />
      
                <button
                  className="
                    mt-3 px-5 py-2.5 rounded-lg
                    bg-indigo-600 text-white font-medium
                    hover:bg-indigo-700 transition
                  "
                >
                  Post Reply
                </button>
              </div>
            )}
          </div>
        </div>
      );
  }
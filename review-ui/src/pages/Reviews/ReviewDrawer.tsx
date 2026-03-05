export default function ReviewDrawer({ review, onClose }) {
  if (!review) return null;

  const isMobile = window.innerWidth < 640; // simple responsive check

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-start sm:justify-end">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* DRAWER */}
      <div
        className={`
          relative z-50
          bg-white/90 backdrop-blur-xl
          border border-gray-200 shadow-2xl
          ${isMobile
            ? "w-full max-h-[85vh] rounded-t-3xl animate-slideUp"
            : "w-[420px] h-full rounded-none animate-slideIn"
          }
          flex flex-col
        `}
      >

        {/* HEADER */}
        <div
          className="
            sticky top-0 z-20
            px-5 py-4
            bg-white/80 backdrop-blur-xl
            border-b border-gray-200
            flex items-center justify-between
          "
        >
          <h2 className="text-[17px] font-semibold text-gray-900">
            Review Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
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
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-10">

          {/* REVIEW HEADER */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
              Review Information
            </h3>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {review.author?.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {review.author}
                  </p>

                  {review.is_local_guide && (
                    <span className="text-[11px] text-orange-600 font-medium">
                      • Local Guide
                    </span>
                  )}
                </div>

                {review.is_local_guide && (
                  <p className="text-[12px] text-gray-500">
                    {review.total_reviews} reviews • {review.total_photos} photos
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500 text-lg leading-none">
                    {"⭐".repeat(review.rating)}
                  </span>

                  <span className="text-[12px] text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEW CONTENT */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
              Review Content
            </h3>

            <div className="relative pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-indigo-500/70"></div>

              <p className="text-[15px] leading-relaxed text-gray-900 font-[460] whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER (Google Only) */}
        {review.source === "google" && (
          <div
            className="
              sticky bottom-0 z-20
              bg-white/90 backdrop-blur-xl
              border-t border-gray-200
              px-5 py-5 space-y-4
            "
          >
            <textarea
              placeholder="Write a public reply…"
              className="
                w-full px-4 py-3.5 rounded-xl
                bg-white border border-gray-300
                text-[15px] text-gray-900 placeholder:text-gray-400
                leading-relaxed shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
              rows={4}
            />

            <button
              className="
                w-full px-5 py-3 rounded-xl
                bg-indigo-600 text-white font-medium
                shadow-md hover:bg-indigo-700 active:scale-[.98]
                transition
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
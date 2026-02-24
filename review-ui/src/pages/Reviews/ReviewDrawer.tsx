export default function ReviewDrawer({ review, onClose }) {
  if (!review) return null;

  return (
    <div
      className="
        fixed right-0 top-0 h-full w-[420px] max-w-full
        bg-white border-l border-gray-300
        shadow-2xl flex flex-col
        animate-slideIn
      "
    >
      {/* HEADER */}
      <div
        className="
          sticky top-0 z-20
          px-6 py-4
          bg-white
          border-b border-gray-300
          flex items-center justify-between
        "
      >
        <h2 className="text-[18px] font-semibold text-gray-900">
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

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">

        {/* ⭐ GOOGLE‑STYLE REVIEW HEADER ⭐ */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
            Review Information
          </h3>

          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              {review.author?.charAt(0)}
            </div>

            <div className="flex-1">
              {/* Name + Local Guide */}
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

              {/* Review count + photo count */}
              {review.is_local_guide && (
                <p className="text-[12px] text-gray-500">
                  {review.total_reviews} reviews • {review.total_photos} photos
                </p>
              )}

              {/* Stars + date */}
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

        {/* SECTION: Review Content */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
            Review Content
          </h3>

          <div
            className="
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  p-5
                  shadow-sm
                  text-[15px]
                  leading-relaxed
                  text-gray-900
                  whitespace-pre-line
                "
          >
            <p className="font-[450] tracking-[0.1px]">
              {review.comment}
            </p>
          </div>
        </div>


      </div>

      {/* STICKY FOOTER (Zendesk style) */}
      {review.source === "google" && (
        <div
          className="
            sticky bottom-0 z-20
            bg-gray-50 border-t border-gray-300
            px-6 py-5
            space-y-4
          "
        >
          <textarea
            placeholder="Write a public reply…"
            className="
              w-full
              px-4 py-3.5
              rounded-lg
              bg-gray-50
              border border-gray-300
              text-[15px] text-gray-900
              placeholder:text-gray-400
              leading-relaxed
              shadow-sm
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              transition-all
            "
            rows={4}
          />

          <button
            className="
              w-full
              px-5 py-3 rounded-md
              bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 transition
            "
          >
            Post Reply
          </button>
        </div>
      )}
    </div>
  );
}
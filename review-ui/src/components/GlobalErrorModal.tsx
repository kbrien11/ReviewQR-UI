export default function GlobalErrorModal({ open, message, onRetry }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Modal */}
            <div className="
          relative z-10
          w-full max-w-sm
          bg-white/90 backdrop-blur-2xl
          border border-white/60
          rounded-3xl
          shadow-[0_8px_24px_rgba(0,0,0,0.15)]
          p-6
          animate-fadeInUp
        ">
                {/* Icon */}
                <div className="
            h-12 w-12 mx-auto mb-4
            rounded-2xl bg-red-100
            flex items-center justify-center
          ">
                    <span className="text-red-600 text-2xl font-bold">!</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                    You’re Offline
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center mt-1 text-sm">
                    {message || "Your session expired or the server went inactive."}
                </p>

                {/* Button */}
                <button
                    onClick={onRetry}
                    className="
              mt-5 w-full py-2.5 rounded-xl
              bg-indigo-600 text-white font-medium
              shadow-sm hover:bg-indigo-700 active:scale-95
              transition-all
            "
                >
                    Log In Again
                </button>
            </div>
        </div>
    )
}
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function TopBar() {
  const { user, logout } = useAuth();
  const { unreadGoogleReviews, markGoogleReviewsAsRead } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInboxClick = () => {
    markGoogleReviewsAsRead();
    navigate("/reviews?tab=google");
  };

  return (
    <header
      className="
        w-full
        h-16 px-6
        flex items-center
        bg-white border-b border-gray-200
      "
    >
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
        Dashboard
      </h2>

      {/* Right: Actions */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Bell Icon */}
        <button
          onClick={handleInboxClick}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700 group-hover:text-black transition"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 18.75a2.25 2.25 0 01-4.5 0m8.25-7.5a6 6 0 10-12 0c0 2.485-.75 3.75-1.5 4.5h15c-.75-.75-1.5-2.015-1.5-4.5z"
            />
          </svg>

          {unreadGoogleReviews > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-red-500 text-white text-[10px] font-semibold
                px-1.5 py-[1px] rounded-full shadow-md ring-1 ring-white
                animate-[pop_0.25s_ease-out]
              "
            >
              {unreadGoogleReviews}
            </span>
          )}
        </button>

        {/* Avatar + User Info (no background card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          {/* Avatar Circle */}
          <div
            className="
              w-9 h-9 rounded-full
              bg-gradient-to-br from-indigo-500 to-purple-500
              flex items-center justify-center
              text-white text-sm font-semibold
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
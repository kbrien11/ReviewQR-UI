import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function TopBar() {
  const { user, logout } = useAuth();
  const { unreadGoogleReviews, markGoogleReviewsAsRead, businessName, businessSlug } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInboxClick = () => {
    markGoogleReviewsAsRead();
    navigate(`/reviews/${businessName}?tab=google`);
  };

  return (
    <header
      className="
        w-full h-14 md:h-16
        px-4 md:px-6
        flex items-center
        bg-white/70 dark:bg-gray-900/40
        backdrop-blur-2xl
        border-b border-gray-200/60 dark:border-gray-700/60
        shadow-[0_1px_0_rgba(255,255,255,0.4)]
        relative z-50
      "
    >
      {/* Title */}
      <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
        Dashboard
      </h2>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">

        {/* QR Code */}
        <button
          onClick={() => navigate(`/business/${businessSlug}/qr`)}
          className="
            h-10 w-10 md:h-11 md:w-11
            flex items-center justify-center
            rounded-2xl
            bg-white/60 dark:bg-gray-800/60
            backdrop-blur-xl
            border border-gray-200/60 dark:border-gray-700/60
            shadow-sm
            hover:bg-white/80 active:scale-95
            transition-all
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700 dark:text-gray-200"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4M4 10h4M16 10h4M10 20h4M10 10h4v4h-4v-4z" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          onClick={handleInboxClick}
          className="
            h-10 w-10 md:h-11 md:w-11
            flex items-center justify-center
            rounded-2xl
            bg-white/60 dark:bg-gray-800/60
            backdrop-blur-xl
            border border-gray-200/60 dark:border-gray-700/60
            shadow-sm
            hover:bg-white/80 active:scale-95
            transition-all
            relative
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-700 dark:text-gray-200"
          >
            <path d="M12 24a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 24zm6.5-6V11a6.5 6.5 0 10-13 0v7L3 18v1h18v-1l-2.5-0z" />
          </svg>

          {unreadGoogleReviews > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-red-500 text-white text-[10px] font-semibold
                px-1.5 py-[1px] rounded-full shadow-md ring-1 ring-white
              "
            >
              {unreadGoogleReviews}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="
            h-10 w-10 md:h-11 md:w-11
            flex items-center justify-center
            rounded-2xl
            bg-white/60 dark:bg-gray-800/60
            backdrop-blur-xl
            border border-gray-200/60 dark:border-gray-700/60
            shadow-sm
            hover:bg-white/80 active:scale-95
            transition-all
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700 dark:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
            />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className="
            h-10 w-10 md:h-11 md:w-11
            rounded-2xl
            bg-gradient-to-br from-indigo-500 to-purple-500
            flex items-center justify-center
            text-white text-sm font-semibold
            shadow-sm
          "
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
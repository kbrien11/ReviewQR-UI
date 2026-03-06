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
        w-full
        h-14 md:h-16
        px-4 md:px-6
        flex items-center
        bg-white border-b border-gray-200
        backdrop-blur-xl
      "
    >
      {/* Left: Page Title */}
      <h2 className="text-base md:text-lg font-semibold text-gray-900 tracking-tight">
        Dashboard
      </h2>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-5 ml-auto">

        {/* Mobile QR Code */}
        <button
          onClick={() => navigate(`/business/${businessName}/qr`)}
          className="
      md:hidden
      h-10 w-10
      flex items-center justify-center
      rounded-xl
      bg-gray-100/80
      backdrop-blur-md
      shadow-sm
      hover:bg-gray-200 active:scale-95
      transition
    "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.5h4.5v4.5h-4.5V4.5zm12 0h4.5v4.5h-4.5V4.5zm-12 12h4.5v4.5h-4.5v-4.5zm12 0h4.5v4.5h-4.5v-4.5z"
            />
          </svg>
        </button>

        {/* Mobile Bell */}
        <button
          onClick={handleInboxClick}
          className="
      h-10 w-10
      flex items-center justify-center
      rounded-xl
      bg-gray-100/80
      backdrop-blur-md
      shadow-sm
      hover:bg-gray-200 active:scale-95
      transition
      relative
    "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700"
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
        "
            >
              {unreadGoogleReviews}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div
          className="
      h-10 w-10
      rounded-xl
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
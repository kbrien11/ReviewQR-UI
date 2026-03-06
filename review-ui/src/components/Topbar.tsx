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
          onClick={() => navigate(`/business/${businessSlug}/qr`)}
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
              d="M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 4h4M4 10h4M16 10h4M10 20h4M10 10h4v4h-4v-4z"
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
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-700"
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
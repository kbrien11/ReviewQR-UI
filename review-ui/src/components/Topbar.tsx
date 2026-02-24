import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { SiGoogle } from "react-icons/si";

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
        h-16 px-6 flex items-center justify-between
        bg-white border-b border-gray-200
      "
    >
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
        Dashboard
      </h2>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">

        <button
          onClick={handleInboxClick}
          className="relative p-2 rounded-md hover:bg-gray-100 transition group"
        >
          {/* Bell Icon */}
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

          {/* Notification Badge */}
          {unreadGoogleReviews > 0 && (
            <span
              className="
        absolute -top-1 -right-1
        bg-red-500 text-white
        text-[10px] font-semibold
        px-1.5 py-[1px]
        rounded-full
        shadow-md
        ring-1 ring-white
        animate-[pop_0.25s_ease-out]
      "
            >
              {unreadGoogleReviews}
            </span>
          )}

          {/* Hover Tooltip */}
          {unreadGoogleReviews > 0 && (
            <div
              className="
        absolute left-1/2 -translate-x-1/2 top-9
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        bg-black text-white text-xs
        py-1 px-2 rounded-md shadow-lg
        whitespace-nowrap pointer-events-none
      "
            >
              You have {unreadGoogleReviews} new review
              {unreadGoogleReviews > 1 ? "s" : ""}
            </div>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-md text-sm font-medium
            bg-gray-100 text-gray-700
            hover:bg-gray-200 hover:text-gray-900
            transition-all shadow-sm
          "
        >
          Logout
        </button>

        {/* Avatar */}
        <div
          className="
            w-10 h-10 rounded-full bg-gray-100 border border-gray-300
            flex items-center justify-center text-gray-700 font-semibold
            shadow-sm
          "
        >
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div >
    </header >
  );
}
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "./Tooltip";


export default function TopBar() {
  const { user, logout } = useAuth();
  const { unreadGoogleReviews, markGoogleReviewsAsRead, businessName, businessSlug } = useApp();
  const navigate = useNavigate();

  const handleInboxClick = () => {
    markGoogleReviewsAsRead();
    navigate(`/reviews/${businessName}?tab=google`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className="
        w-full
        h-14 md:h-16
        px-4 md:px-6
        flex items-center
        bg-white/80 backdrop-blur-2xl
        border-b border-white/60
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
      "
    >

      {/* LEFT: Mobile-only icons */}
      <div className="md:hidden flex items-center gap-1 mr-3">

        {/* QR */}
        <Tooltip label="QR Code">
          <button
            onClick={() => navigate(`/business/${businessSlug}/qr`)}
            className="
              h-10 w-10 flex items-center justify-center
              rounded-2xl bg-white/80 backdrop-blur-xl
              border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
              hover:bg-white/90 active:scale-95 transition-all
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
              className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M10 4h4M4 10h4M16 10h4M10 20h4M10 10h4v4h-4v-4z" />
            </svg>
          </button>
        </Tooltip>

        {/* Billing */}
        {/* <Tooltip label="Billing & Payment">
          <button
            onClick={() => navigate(`/admin/plan/${businessSlug}`)}
            className="
              h-10 w-10 flex items-center justify-center
              rounded-2xl bg-white/80 backdrop-blur-xl
              border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
              hover:bg-white/90 active:scale-95 transition-all
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
              className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 8.25h19.5m-16.5 4.5h6m-6 3h3m13.5-7.5v9a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15a2.25 2.25 0 012.25 2.25z" />
            </svg>
          </button>
        </Tooltip> */}

        {/* Reward */}
        <Tooltip label="Reward">
          <button
            onClick={() => navigate(`/admin/reward/${businessSlug}`)}
            className="
              h-10 w-10 flex items-center justify-center
              rounded-2xl bg-white/80 backdrop-blur-xl
              border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
              hover:bg-white/90 active:scale-95 transition-all
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
              className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8.25c-1.5-3-6-3-6 1.5 0 3 3 6 6 9 3-3 6-6 6-9 0-4.5-4.5-4.5-6-1.5z" />
            </svg>
          </button>
        </Tooltip>

      </div>

      {/* CENTER: Title */}
      <div className="flex-1 flex justify-center md:justify-start">
        <h2 className="text-[17px] md:text-[19px] font-semibold text-gray-900 tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* RIGHT: Notifications, Logout, Avatar */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Notifications */}
        <Tooltip label={`${unreadGoogleReviews} new reviews`}>
          <button
            onClick={handleInboxClick}
            className="
              h-10 w-10 flex items-center justify-center
              rounded-2xl bg-white/80 backdrop-blur-xl
              border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
              hover:bg-white/90 active:scale-95 transition-all relative
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="w-5 h-5 text-gray-700">
              <path d="M12 24a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 24zm6.5-6V11a6.5 6.5 0 10-13 0v7L3 18v1h18v-1l-2.5-0z" />
            </svg>

            {unreadGoogleReviews > 0 && (
              <span
                className="
                  absolute -top-1 -right-1 bg-red-500 text-white text-[10px]
                  font-semibold px-1.5 py-[1px] rounded-full shadow-[0_0_0_2px_white]
                "
              >
                {unreadGoogleReviews}
              </span>
            )}
          </button>
        </Tooltip>

        {/* Logout */}
        <Tooltip label="Log Out">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="
              h-10 w-10 md:h-11 md:w-11 flex items-center justify-center
              rounded-2xl bg-white/80 backdrop-blur-xl
              border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)]
              hover:bg-white/90 active:scale-95 transition-all
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
              className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
            </svg>
          </button>
        </Tooltip>

        {/* Avatar */}
        <div
          className="
            h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500
            flex items-center justify-center text-white text-sm font-semibold
            shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          "
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

      </div>
    </header>
  );
}
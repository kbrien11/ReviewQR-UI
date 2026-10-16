
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "./Tooltip";
import {
  Bell,
  QrCode,
  Gift,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";

export default function TopBar() {
  const { user, logout } = useAuth();

  const {
    unreadGoogleReviews = 0,
    markGoogleReviewsAsRead,
    businessName,
    businessSlug,
  } = useApp();

  const navigate = useNavigate();

  const handleInboxClick = () => {
    markGoogleReviewsAsRead?.();

    const reviewIdentifier = businessSlug || businessName;

    navigate(
      reviewIdentifier
        ? `/reviews/${encodeURIComponent(reviewIdentifier)}?tab=google`
        : "/reviews?tab=google"
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToQR = () => {
    if (businessSlug) {
      navigate(`/business/${encodeURIComponent(businessSlug)}/qr`);
    }
  };

  const goToRewards = () => {
    navigate("/admin/reward");
  };

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const iconButtonClass =
    "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " +
    "border border-gray-200/80 bg-white text-gray-600 shadow-sm " +
    "transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 " +
    "hover:text-indigo-600 active:scale-95 focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-gray-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left: Mobile shortcuts */}
      <div className="flex items-center gap-2 md:hidden">
        <Tooltip label="QR Code">
          <button
            type="button"
            onClick={goToQR}
            aria-label="Open QR code"
            className={iconButtonClass}
          >
            <QrCode size={19} strokeWidth={1.8} />
          </button>
        </Tooltip>

        <Tooltip label="Rewards">
          <button
            type="button"
            onClick={goToRewards}
            aria-label="Open rewards"
            className={iconButtonClass}
          >
            <Gift size={19} strokeWidth={1.8} />
          </button>
        </Tooltip>
      </div>

      {/* Center / left: Page identity */}
      <div className="ml-3 flex min-w-0 flex-1 items-center md:ml-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 md:hidden">
          <LayoutDashboard size={20} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 md:ml-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
            Dashboard
          </h1>

          <p className="hidden truncate text-xs text-gray-500 sm:block">
            {businessName
              ? `Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`
              : "Your business at a glance"}
          </p>
        </div>
      </div>

      {/* Desktop business shortcuts */}
      <div className="mr-5 hidden items-center gap-2 md:flex">
        <Tooltip label="QR Code">
          <button
            type="button"
            onClick={goToQR}
            className={iconButtonClass}
            aria-label="Open QR code"
          >
            <QrCode size={19} strokeWidth={1.8} />
          </button>
        </Tooltip>

        <Tooltip label="Rewards">
          <button
            type="button"
            onClick={goToRewards}
            className={iconButtonClass}
            aria-label="Open rewards"
          >
            <Gift size={19} strokeWidth={1.8} />
          </button>
        </Tooltip>
      </div>

      {/* Right: Notifications and account */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Tooltip
          label={
            unreadGoogleReviews === 1
              ? "1 new review"
              : `${unreadGoogleReviews} new reviews`
          }
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={handleInboxClick}
            aria-label={`Open Google reviews. ${unreadGoogleReviews} unread reviews`}
            className={iconButtonClass}
          >
            <Bell size={19} strokeWidth={1.8} />

            {unreadGoogleReviews > 0 && (
              <motion.span
                key={unreadGoogleReviews}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1.5 -top-1.5 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
              >
                {unreadGoogleReviews > 99 ? "99+" : unreadGoogleReviews}
              </motion.span>
            )}
          </motion.button>
        </Tooltip>

        <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

        {/* Account identity */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-sm ring-1 ring-indigo-500/10">
            {initials}
          </div>

          <div className="hidden min-w-0 lg:block">
            <p className="max-w-36 truncate text-sm font-semibold text-gray-800">
              {user?.name || "Your account"}
            </p>
            <p className="max-w-36 truncate text-xs text-gray-500">
              {businessName || "Business dashboard"}
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-gray-400 lg:block"
            aria-hidden="true"
          />
        </div>

        <Tooltip label="Log out">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-gray-500 transition-all duration-200 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-95"
          >
            <LogOut size={19} strokeWidth={1.8} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}

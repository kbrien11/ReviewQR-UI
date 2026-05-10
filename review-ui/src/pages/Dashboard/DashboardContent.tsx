import { useParams, Link } from "react-router-dom";
import DashboardSkeleton from "./DashboardSkeleton";
import DeviceBreakdown from "./DeviceBreakdown";
import LatestReview from "./LatestReview";
import SentimentOverview from "./SentimentOverview";
import { useDashboardSummary } from "./useDashboardSummary";
import { motion } from "framer-motion";
import FadeIn from "../../components/animations/FadeIn";
import Stagger, { staggerItem } from "../../components/Stagger";
import DashboardCard from "./DashboardCard";
import { UseAIReviews } from './UseAIReviews'
import ReviewInsightsCard from "./ReviewInsightsCard";
import { useApp } from "../../context/AppContext";
import LocationDropdown from "./LocationDropdown";
import { useEffect, useState } from "react";
import PlanBadge from "./PlanBadge";





export default function Dashboard() {
  const { insights, loadingInsights } = UseAIReviews();
  const { slug } = useParams();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { data, loading } = useDashboardSummary(selectedLocation);

  const { businessSlug, locations, planType } = useApp();

  useEffect(() => {
    if (locations && locations.length > 1 && !selectedLocation) {
      setShowLocationModal(true);
    } else {
      setShowLocationModal(false);
    }
  }, [locations, selectedLocation]);


  if (loading || !data) return <DashboardSkeleton />;

  const IconExcellent = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-6.5L2 10h7z" />
    </svg>
  );

  const IconGood = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 11l3 3 4-4" />
    </svg>
  );

  const IconOkay = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15h8" />
    </svg>
  );

  const IconBelowAverage = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 14l6-3" />
    </svg>
  );

  const IconPoor = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15l6-6" />
    </svg>
  );

  const IconTerrible = (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );

  const getRatingIcon = (rating: number) => {
    if (rating >= 4.5) return IconExcellent;        // excellent
    if (rating >= 4.0) return IconGood;             // good
    if (rating >= 3.5) return IconOkay;             // ok
    if (rating >= 3.0) return IconBelowAverage;     // below average
    if (rating >= 2.0) return IconPoor;            // awful
    return IconTerrible;                              // danger
  };

  const TotalReviewsIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="14" height="14" rx="2" />
      <path d="M7 8h6M7 12h4" />
      <path d="M17 6v12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
    </svg>
  );

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);     // store the chosen location
    setShowLocationModal(false);  // close the modal
  };

  const shouldBlockDashboard =
    data.location_franchise === true &&
    locations &&
    locations.length > 1 &&
    !selectedLocation;





  return (
    <>
      {/* LOCATION SELECTION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Choose a Location
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Select which location you want to view analytics for.
            </p>

            <div className="space-y-3">
              {locations?.map((address) => (
                <button
                  key={address}
                  onClick={() => handleLocationSelect(address)}
                  className="
                    w-full text-left px-4 py-3 rounded-xl border border-gray-200
                    hover:bg-gray-50 transition-all active:scale-[0.98]
                  "
                >
                  <div className="font-medium text-gray-900">{address}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOCK DASHBOARD UNTIL LOCATION IS SELECTED */}
      {shouldBlockDashboard ? null : (
        <div className="min-h-screen bg-gray-50 flex flex-col">

          {/* HEADER */}
          <FadeIn>
            <div className="
              relative px-4 py-6 md:px-8 md:py-10
              rounded-b-3xl
              bg-white/70 backdrop-blur-2xl
              border-b border-gray-200/60
              shadow-[0_8px_30px_rgba(0,0,0,0.04)]
              overflow-hidden
            ">
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-indigo-300/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-300/20 blur-3xl rounded-full" />
              </div>

              {/* Content */}
              <div className="relative flex flex-col gap-3 z-10">

                {/* Title Row + Plan Badge */}
                <div className="flex items-start justify-between gap-4 w-full">

                  {/* Left: Title */}
                  <div className="flex items-center gap-4">
                    <div className="
                          w-1.5 h-12 md:h-16 rounded-full
                          bg-gradient-to-b from-indigo-500 to-indigo-600
                          shadow-[0_0_14px_rgba(99,102,241,0.35)]
                        " />

                    <div className="flex flex-col">
                      <h1 className="
                          text-2xl md:text-4xl font-semibold tracking-tight
                          bg-gradient-to-r from-slate-900 to-slate-700
                          bg-clip-text text-transparent
                        ">
                        {data.business_name} Analytics
                      </h1>
                      <p className="text-xs md:text-base text-gray-500">
                        {data.status_message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Plan Badge */}
                  <PlanBadge />
                </div>

                {/* LOCATION DROPDOWN */}
                {data.location_franchise && (
                  <LocationDropdown
                    selected={selectedLocation}
                    onSelect={(loc) => setSelectedLocation(loc)}
                  />
                )}

              </div>
            </div>
          </FadeIn>

          {/* EMPTY STATE */}
          {data.total_reviews === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fadeIn">
              <div className="
                w-24 h-24 rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-200
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                flex items-center justify-center mb-6
              ">
                <svg
                  className="w-12 h-12 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h18M3 7h18M3 21h18M3 11h18M3 15h18"
                  />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                No Reviews Yet
              </h2>

              <p className="text-gray-600 max-w-sm mb-8 text-sm md:text-base">
                Ask your customers to scan your QR code to leave a review.
                Once reviews start coming in, your analytics will appear here.
              </p>

              <Link
                to={`/business/${businessSlug}/qr`}
                className="
                  px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium
                  shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all
                  active:scale-[0.98]
                "
              >
                View Your QR Code
              </Link>
            </div>
          )}

          {/* MAIN CONTENT */}
          {data.total_reviews > 0 && (
            <div
              className="
              w-full px-4 sm:px-6 lg:px-10 xl:px-14
              py-6
              max-w-[1500px] mx-auto
            "
            >

              {/* KPI ROW */}
              <Stagger>
                <div
                  className="
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                  gap-4 sm:gap-6 mb-10
                "
                >
                  <motion.div variants={staggerItem}>
                    <DashboardCard
                      label="Total Reviews"
                      value={data.total_reviews}
                      icon={TotalReviewsIcon()}
                      trend={data.total_reviews_trend}
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <DashboardCard
                      label="Avg Rating"
                      value={data.avg_rating}
                      icon={getRatingIcon(data.avg_rating)}
                      trend={data.avg_rating_trend}
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <DashboardCard
                      label="Reviews Last 7 Days"
                      value={data.last_7_days}
                      icon="📅"
                      trend={data.last_7_days_trend}
                    />
                  </motion.div>
                </div>
              </Stagger>

              {/* GRID */}
              <div
                className="
                grid grid-cols-1 lg:grid-cols-3
                gap-6 lg:gap-8
              "
              >

                {/* LEFT COLUMN */}
                <div className="space-y-6 lg:col-span-2">
                  {/* AI INSIGHTS — MOBILE */}
                  <motion.div
                    className="lg:hidden"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <div className="mb-2 text-xs font-semibold text-gray-500 tracking-wide">
                      AI Insights
                    </div>

                    {planType === "starter" ? (
                      <div
                        className="
        bg-white/60 backdrop-blur-xl border border-white/40 
        rounded-2xl p-6 text-center shadow-sm
      "
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Upgrade Required
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                          Upgrade to <span className="font-semibold">Pro</span> to unlock AI Insights.
                        </p>

                        <Link
                          to={`/admin/plan/${businessSlug}`}
                          className="
                            inline-block px-4 py-2
                            rounded-full
                            bg-indigo-600 text-white text-sm font-medium
                            hover:bg-indigo-700 transition
                            shadow-sm
                          "
                        >
                          Upgrade to Pro
                        </Link>
                      </div>
                    ) : (
                      <>
                        {loadingInsights && (
                          <div className="animate-pulse h-48 bg-gray-200 rounded-2xl" />
                        )}

                        {!loadingInsights && insights && (
                          <ReviewInsightsCard insights={insights} />
                        )}
                      </>
                    )}
                  </motion.div>

                  {/* CONVERSION ANALYTICS */}
                  <FadeIn delay={0.2}>
                    <DeviceBreakdown
                      scans={data.total_scans}
                      reviews={data.total_reviews}
                    />
                  </FadeIn>

                  {/* LATEST REVIEWS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <LatestReview reviews={data.latest_reviews} />
                  </motion.div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  <motion.div
                    className="hidden lg:block"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    {planType === 'starter' ? (
                      <div
                        className="
                         bg-white/60 backdrop-blur-xl border border-white/40 
                         rounded-2xl p-6 text-center shadow-sm
                       "
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Upgrade Required
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                          Upgrade to <span className="font-semibold">Pro</span> to unlock AI Insights.
                        </p>

                        <Link
                          to={`/admin/plan/${businessSlug}`}

                          className="
                           inline-block px-4 py-2
                           rounded-full
                           bg-indigo-600 text-white text-sm font-medium
                           hover:bg-indigo-700 transition
                           shadow-sm
                         "
                        >
                          Upgrade to Pro
                        </Link>
                      </div>
                    ) : (
                      <>
                        {loadingInsights && (
                          <div className="animate-pulse h-48 bg-gray-200 rounded-2xl" />
                        )}

                        {!loadingInsights && insights && (
                          <ReviewInsightsCard insights={insights} />
                        )}
                      </>
                    )}
                  </motion.div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}


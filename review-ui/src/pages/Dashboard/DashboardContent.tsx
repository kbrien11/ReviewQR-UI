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


export default function Dashboard() {
  const { slug } = useParams();
  const { data, loading } = useDashboardSummary();

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <FadeIn>
        <div
          className="
      relative
      px-4 py-5 md:px-6 md:py-8
      rounded-b-3xl
      bg-white/80 
      backdrop-blur-2xl
      border-b border-gray-200/60 
      shadow-[0_4px_20px_rgba(0,0,0,0.04)]
      overflow-hidden
    "
        >
          {/* Soft background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-indigo-300/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-300/20 blur-3xl rounded-full" />
          </div>

          {/* Content */}
          <div className="relative flex items-center gap-4 z-10">

            {/* Premium Accent Bar */}
            <div
              className="
          w-1.5 h-10 md:h-14
          rounded-full
          bg-gradient-to-b from-indigo-500 to-indigo-600
          shadow-[0_0_12px_rgba(99,102,241,0.35)]
        "
            />

            {/* Title Block */}
            <div className="flex flex-col">
              <h1
                className="
            text-xl md:text-4xl font-semibold tracking-tight
            bg-gradient-to-r from-slate-900 to-slate-700 
            
            bg-clip-text text-transparent
            leading-tight
          "
              >
                {data.business_name} Analytics
              </h1>

              <p className="text-xs md:text-base text-gray-500 ">
                {data.status_message}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
      {/* MAIN CONTENT */}
      <div className="
        w-full 
        px-4 sm:px-6 lg:px-12 
        py-6 
        max-w-full md:max-w-6xl lg:max-w-7xl xl:max-w-[1400px] 
        mx-auto
      ">

        {/* KPI ROW */}
        <Stagger>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">

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

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Public Reviews"
                value={data.public_reviews}
                icon="🌐"
                trend={data.public_reviews_trend}
              />
            </motion.div>

          </div>
        </Stagger>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">

            <FadeIn delay={0.1}>
              <SentimentOverview data={data} />
            </FadeIn>

            {data?.device_breakdown && (
              <FadeIn delay={0.2}>
                <DeviceBreakdown
                  data={data.device_breakdown}
                  slug={data.business_slug}
                />
              </FadeIn>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <LatestReview reviews={data.latest_reviews} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
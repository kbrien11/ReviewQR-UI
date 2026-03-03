import { useParams, Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import DashboardSkeleton from "./DashboardSkeleton";
import DeviceBreakdown from "./DeviceBreakdown";
import LatestReview from "./LatestReview";
import SentimentOverview from "./SentimentOverview";
import { useDashboardSummary } from "./useDashboardSummary";

import { motion } from "framer-motion";
import FadeIn from "../../components/animations/FadeIn";
import Stagger, { staggerItem } from "../../components/Stagger";


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
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <FadeIn>
        <div className="bg-white border-b border-gray-200 px-6 py-8 shadow-sm">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {/* Finance Accent Bar */}
              <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
              <div className="flex flex-col">
                <h1 className="
        text-3xl md:text-4xl font-semibold tracking-tight
        bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent
      ">
                  {data.business_name} Analytics
                </h1>
              </div>
            </div>
          </div>

          <p className="mt-2 text-gray-500 text-sm md:text-base">
            {data.status_message}
          </p>
        </div>
      </FadeIn>

      {/* MAIN CONTENT */}
      <div className="p-8 w-full max-w-[1600px]">

        {/* KPI ROW */}
        <Stagger>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

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
                label="Last 7 Days"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

          {/* LEFT COLUMN */}
          <div className="space-y-8 lg:col-span-2">

            {/* Sentiment */}
            <FadeIn delay={0.1}>
              <SentimentOverview data={data} />
            </FadeIn>

            {/* Device Breakdown */}
            {data?.device_breakdown && (
              <FadeIn delay={0.2}>
                <DeviceBreakdown
                  data={data.device_breakdown}
                  slug={data.business_slug}
                />
              </FadeIn>
            )}
          </div>

          {/* RIGHT COLUMN — Latest Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <LatestReview reviews={data.latest_reviews} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
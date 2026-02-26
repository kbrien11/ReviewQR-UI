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

  const getRatingIcon = (rating: number) => {
    if (rating >= 4.5) return "🤩";
    if (rating >= 3.5) return "😄";
    if (rating >= 2.5) return "🙂";
    if (rating >= 1.5) return "😕";
    return "😡";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="
    bg-white border-b border-gray-200
    px-6 py-8 shadow-sm relative overflow-hidden
  ">

          {/* Soft gradient accent */}
          <div className="
      absolute inset-0 pointer-events-none
      bg-gradient-to-r from-indigo-50 to-transparent
      opacity-60
    " />

          <div className="relative flex flex-col gap-2">
            {/* Business Name */}
            <h1 className="
        text-3xl md:text-4xl font-bold tracking-tight text-gray-900
        flex items-center gap-3
      ">
              {/* Icon / Logo */}
              <div className="
          w-10 h-10 rounded-xl bg-indigo-600 text-white
          flex items-center justify-center text-lg font-bold
          shadow-sm
        ">
                {data.business_name.charAt(0).toUpperCase()}
              </div>

              {data.business_name} Analytics
            </h1>

            {/* Status Message */}
            <p className="text-gray-500 text-sm md:text-base">
              {data.status_message}
            </p>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="p-8 w-full max-w-[1600px]">

        {/* KPI ROW */}
        <Stagger>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Total Reviews"
                value={data.total_reviews}
                icon="⭐"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Avg Rating"
                value={data.avg_rating}
                icon={getRatingIcon(data.avg_rating)}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Last 7 Days"
                value={data.last_7_days}
                icon="📅"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Public Reviews"
                value={data.public_reviews}
                icon="🌐"
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
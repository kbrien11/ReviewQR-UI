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
      <FadeIn>
        <div className="bg-white border-b border-gray-200 px-6 py-8 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {data.business_name} Analytics
            </h1>

            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-semibold transition-all hover:scale-[1.03]"
            >
              ReviewQR
            </Link>
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
                icon="⭐"
                trend = {data.total_reviews_trend}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Avg Rating"
                value={data.avg_rating}
                icon={getRatingIcon(data.avg_rating)}
                trend = {data.avg_rating_trend}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Last 7 Days"
                value={data.last_7_days}
                icon="📅"
                trend = {data.last_7_days_trend}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <DashboardCard
                label="Public Reviews"
                value={data.public_reviews}
                icon="🌐"
                trend = {data.public_reviews_trend}
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
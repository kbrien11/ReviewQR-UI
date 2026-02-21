import { useParams, Link, NavLink } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import DashboardSkeleton from "./DashboardSkeleton";
import DeviceBreakdown from "./DeviceBreakdown";
import LatestReview from "./LatestReview";
import SentimentOverview from "./SentimentOverview";
import { useDashboardSummary } from "./useDashboardSummary";


export default function Dashboard() {
  const { slug } = useParams();
  const { data, loading } = useDashboardSummary();

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div
        className="
    relative overflow-hidden
    bg-gradient-to-r from-slate-900 to-slate-700
    text-white p-8 md:p-10
    shadow-xl rounded-b-3xl
    animate-fadeInUp
  "
        style={{ animationDuration: "600ms" }}
      >
        {/* Glow Accent */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

        {/* Floating Blur Orb */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-20"></div>

        <div className="relative flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            {data.business_name} Analytics
          </h1>

          <Link
            to="/"
            className="
        text-white/80 hover:text-white font-semibold
        transition-all duration-300 hover:scale-105
      "
          >
            ReviewQR
          </Link>
        </div>

        <p className="mt-3 text-slate-300 text-sm md:text-base animate-fadeIn opacity-90">
          {data.status_message}
        </p>
      </div>



      {/* MAIN GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI CARDS */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-5">
          <DashboardCard
            label="Total Reviews"
            value={data.total_reviews}
            color="from-blue-500 to-blue-600"
            icon="⭐"
            delay={0}
          />
          <DashboardCard
            label="Avg Rating"
            value={data.avg_rating}
            color="from-yellow-400 to-yellow-500"
            icon="🌟"
            delay={100}
          />
          <DashboardCard
            label="Last 7 Days"
            value={data.last_7_days}
            color="from-green-500 to-green-600"
            icon="📅"
            delay={200}
          />
          <DashboardCard
            label="Public Reviews"
            value={data.public_reviews}
            color="from-purple-500 to-purple-600"
            icon="🌐"
            delay={300}
          />
        </div>

        <DeviceBreakdown data={data.device_breakdown} slug={data.business_slug} />
        <SentimentOverview data={data} />
        <LatestReview reviews={data.latest_reviews} />
      </div>
    </div>
  );
}
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 shadow-xl rounded-b-3xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {data.business_name} Analytics
          </h1>
          <Link to="/" className="text-white/80 hover:text-white font-semibold transition-all">
            ReviewQR
          </Link>
        </div>
        <p className="mt-2 text-slate-300">{data.status_message}</p>
      </div>



      {/* MAIN GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI CARDS */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <DashboardCard label="Total Reviews" value={data.total_reviews} color="bg-blue-600" />
          <DashboardCard label="Avg Rating" value={data.avg_rating} color="bg-yellow-500" />
          <DashboardCard label="Last 7 Days" value={data.last_7_days} color="bg-green-600" />
          <DashboardCard label="Public Reviews" value={data.public_reviews} color="bg-purple-600" />
        </div>

        <DeviceBreakdown data={data.device_breakdown} slug={data.business_slug} />
        <SentimentOverview data={data} />
        <LatestReview reviews={data.latest_reviews} />
      </div>
    </div>
  );
}
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

  const showEmptyState =
  data.device_breakdown === 0 && data.total_reviews === 0;

  return (
    <div className="min-h-screen bg-gray-50">
  
      {/* HEADER */}
      <div
        className="
          bg-white border-b border-gray-200
          px-6 py-8 shadow-sm
          animate-fadeInUp
        "
      >
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
  
      {/* MAIN CONTENT */}
      <div className="p-6 max-w-6xl mx-auto">
  
        {/* EMPTY STATE — if no scans + no reviews */}
        {data.total_reviews === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 animate-fadeInUp">
  
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 shadow-sm">
              <svg
                className="w-10 h-10 text-indigo-600"
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
  
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Activity Yet
            </h2>
  
            <p className="text-gray-600 max-w-sm mb-6">
              Print or download your QR code and place it where customers can see it.
              Once they scan it, your analytics will appear here.
            </p>
  
            <Link
             to={`/business/${data.business_slug}/qr`}
              className="
                px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium
                hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md
              "
            >
              Go to QR Code
            </Link>
          </div>
        ) : (
          <>
            {/* KPI ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <DashboardCard label="Total Reviews" value={data.total_reviews} icon="⭐" delay={0} />
              <DashboardCard label="Avg Rating" value={data.avg_rating} icon="🌟" delay={100} />
              <DashboardCard label="Last 7 Days" value={data.last_7_days} icon="📅" delay={200} />
              <DashboardCard label="Public Reviews" value={data.public_reviews} icon="🌐" delay={300} />
            </div>
  
            {/* TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
              {/* LEFT COLUMN — ANALYTICS MODULES */}
              <div className="space-y-6 md:col-span-2">
  
                {/* Sentiment Overview */}
                <div
                  className="
                    bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                    hover:shadow-md hover:-translate-y-[2px]
                    transition-all duration-300 animate-fadeInUp
                  "
                >
                  <SentimentOverview data={data} />
                </div>
  
                {/* Device Breakdown */}
                <div
                  className="
                    bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                    hover:shadow-md hover:-translate-y-[2px]
                    transition-all duration-300 animate-fadeInUp
                  "
                >
                  <DeviceBreakdown data={data.device_breakdown} slug={data.business_slug} />
                </div>
  
              </div>
  
              {/* RIGHT COLUMN — ACTIVITY FEED */}
              <div
                className="
                  bg-white p-6 rounded-xl border border-gray-200 shadow-sm
                  animate-fadeInUp flex flex-col
                "
              >
                <LatestReview reviews={data.latest_reviews} />
              </div>
  
            </div>
          </>
        )}
  
      </div>
    </div>
  );
}
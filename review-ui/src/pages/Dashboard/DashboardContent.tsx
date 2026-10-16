
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useDashboardSummary } from "./useDashboardSummary";
import { UseAIReviews } from "./UseAIReviews";
import { useApp } from "../../context/AppContext";

import DashboardSkeleton from "./DashboardSkeleton";
import DeviceBreakdown from "./DeviceBreakdown";
import LatestReview from "./LatestReview";
import ReviewInsightsCard from "./ReviewInsightsCard";
import DashboardCard from "./DashboardCard";
import LocationDropdown from "./LocationDropdown";
import PlanBadge from "./PlanBadge";

import FadeIn from "../../components/animations/FadeIn";
import Stagger, { staggerItem } from "../../components/Stagger";

// -------------------------
// Icons
// -------------------------

function TotalReviewsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-indigo-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="14" height="14" rx="2" />
      <path d="M7 8h6M7 12h4" />
      <path d="M17 6v12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
    </svg>
  );
}

function RatingIcon({ rating }) {
  const value = Number(rating) || 0;

  const config =
    value >= 4.5
      ? {
          color: "text-green-600",
          path: "M12 3l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-6.5L2 10h7z",
        }
      : value >= 4
        ? {
            color: "text-emerald-500",
            path: "M9 11l3 3 4-4",
          }
        : value >= 3.5
          ? {
              color: "text-yellow-500",
              path: "M8 15h8",
            }
          : value >= 3
            ? {
                color: "text-amber-600",
                path: "M9 14l6-3",
              }
            : value >= 2
              ? {
                  color: "text-orange-600",
                  path: "M9 15l6-6",
                }
              : {
                  color: "text-red-600",
                  path: "M9 9l6 6M15 9l-6 6",
                };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-9 w-9 ${config.color}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {value >= 4.5 ? (
        <path d={config.path} />
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d={config.path} />
        </>
      )}
    </svg>
  );
}

// -------------------------
// Reusable AI insights panel
// -------------------------

function AIInsightsPanel({
  planType,
  businessSlug,
  insights,
  loadingInsights,
}) {
  if (planType === "starter") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
            ✦
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Premium feature
          </p>

          <h3 className="mt-2 text-lg font-bold text-gray-900">
            Unlock AI Insights
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Discover customer sentiment, recurring feedback, and
            opportunities to improve your business.
          </p>

          <Link
            to={`/admin/plan/${businessSlug}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Upgrade to Pro
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loadingInsights) {
    return (
      <div
        className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
        aria-label="Loading AI insights"
      >
        <div className="h-5 w-36 rounded bg-gray-200" />
        <div className="mt-5 h-4 w-full rounded bg-gray-100" />
        <div className="mt-3 h-4 w-4/5 rounded bg-gray-100" />
        <div className="mt-7 h-16 rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (insights) {
    return <ReviewInsightsCard insights={insights} />;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <h3 className="font-semibold text-gray-900">AI Insights</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Your insights will appear here when enough feedback is available.
      </p>
    </div>
  );
}

// -------------------------
// Location selection modal
// -------------------------

function LocationSelectionModal({ locations, onSelect }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            <span aria-hidden="true">⌖</span>
          </div>

          <h2
            id="location-modal-title"
            className="text-2xl font-bold tracking-tight"
          >
            Choose a location
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-100">
            Select a business location to view its performance and
            customer reviews.
          </p>
        </div>

        <div className="space-y-3 p-5">
          {locations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => onSelect(location)}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/70 active:scale-[0.99]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4" />
                  </svg>
                </div>

                <span className="break-words font-semibold text-gray-800">
                  {location}
                </span>
              </div>

              <span className="shrink-0 text-indigo-600 transition group-hover:translate-x-1">
                →
              </span>
            </button>
          ))}
        </div>

        <p className="px-5 pb-5 text-center text-xs text-gray-400">
          You can switch locations from your dashboard.
        </p>
      </div>
    </div>
  );
}

// -------------------------
// Dashboard
// -------------------------

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data, loading } = useDashboardSummary(selectedLocation);
  const { insights, loadingInsights } = UseAIReviews();
  const { businessSlug, locations, planType } = useApp();

  const hasMultipleLocations = (locations?.length ?? 0) > 1;

  // Require a location selection when a business has multiple locations.
  useEffect(() => {
    if (!hasMultipleLocations) {
      setSelectedLocation(null);
    }
  }, [hasMultipleLocations]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const showLocationModal =
    !loading &&
    data?.location_franchise === true &&
    hasMultipleLocations &&
    !selectedLocation;

  const shouldBlockDashboard =
    data?.location_franchise === true &&
    hasMultipleLocations &&
    !selectedLocation;

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  if (shouldBlockDashboard) {
    return (
      <LocationSelectionModal
        locations={locations ?? []}
        onSelect={handleLocationSelect}
      />
    );
  }

  const totalReviews = Number(data.total_reviews) || 0;
  const averageRating = Number(data.avg_rating) || 0;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {showLocationModal && (
        <LocationSelectionModal
          locations={locations ?? []}
          onSelect={handleLocationSelect}
        />
      )}

      {/* Header */}
      <FadeIn>
        <header className="relative overflow-hidden border-b border-gray-200/70 bg-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-[1600px] px-4 py-7 sm:px-6 md:py-9 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="mt-1 h-12 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                    Business overview
                  </p>

                  <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                    {data.business_name}{" "}
                    <span className="text-indigo-600">Analytics</span>
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                    {data.status_message ||
                      "Here’s how your business is performing."}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center self-start sm:self-center">
                <PlanBadge />
              </div>
            </div>

            {data.location_franchise && hasMultipleLocations && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Viewing location
                </p>

                <LocationDropdown
                  selected={selectedLocation}
                  onSelect={handleLocationSelect}
                />
              </div>
            )}
          </div>
        </header>
      </FadeIn>

      {/* Empty state */}
      {totalReviews === 0 && (
        <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:py-28">
          <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-900/5">
            <div className="absolute inset-2 rounded-2xl bg-indigo-50" />

            <svg
              className="relative h-11 w-11 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 5h16v14H4zM8 9h8M8 13h5"
              />
              <path
                strokeLinecap="round"
                d="M8 2v6M16 2v6"
              />
            </svg>
          </div>

          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Your dashboard is ready
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your first reviews start here
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
            Share your ReviewQR code with customers to start collecting
            feedback. Once reviews come in, you’ll see your analytics,
            customer sentiment, and performance trends right here.
          </p>

          <Link
            to={`/business/${businessSlug}/qr`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
          >
            View your QR code
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-4 text-xs text-gray-400">
            Tip: Place your QR code somewhere customers can easily scan it.
          </p>
        </main>
      )}

      {/* Analytics dashboard */}
      {totalReviews > 0 && (
        <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
          {/* Page intro */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Performance overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A snapshot of your customer feedback and review activity.
              </p>
            </div>

            {selectedLocation && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {selectedLocation}
              </div>
            )}
          </div>

          {/* KPI cards */}
          <Stagger>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <motion.div variants={staggerItem}>
                <DashboardCard
                  label="Total Reviews"
                  value={totalReviews}
                  icon={<TotalReviewsIcon />}
                  trend={data.total_reviews_trend}
                />
              </motion.div>

              <motion.div variants={staggerItem}>
                <DashboardCard
                  label="Average Rating"
                  value={averageRating.toFixed(1)}
                  icon={<RatingIcon rating={averageRating} />}
                  trend={data.avg_rating_trend}
                />
              </motion.div>

              <motion.div variants={staggerItem}>
                <DashboardCard
                  label="Reviews Last 7 Days"
                  value={data.last_7_days ?? 0}
                  icon="📅"
                  trend={data.last_7_days_trend}
                />
              </motion.div>
            </div>
          </Stagger>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3 xl:gap-7">
            {/* Left column */}
            <div className="min-w-0 space-y-6 xl:col-span-2">
              {/* AI insights on mobile/tablet */}
              <section className="xl:hidden">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    ✦
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      AI Review Insights
                    </h2>
                    <p className="text-xs text-gray-500">
                      Understand what your customers are saying
                    </p>
                  </div>
                </div>

                <AIInsightsPanel
                  planType={planType}
                  businessSlug={businessSlug}
                  insights={insights}
                  loadingInsights={loadingInsights}
                />
              </section>

              {/* Scan-to-review analytics */}
              <FadeIn delay={0.1}>
                <section>
                  <div className="mb-3">
                    <h2 className="text-lg font-bold text-gray-900">
                      QR performance
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      See how your QR scans translate into reviews.
                    </p>
                  </div>

                  <DeviceBreakdown
                    scans={data.total_scans}
                    reviews={data.total_reviews}
                  />
                </section>
              </FadeIn>

              {/* Latest reviews */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    Latest reviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Stay up to date with recent customer feedback.
                  </p>
                </div>

                <LatestReview reviews={data.latest_reviews ?? []} />
              </motion.section>
            </div>

            {/* Right column */}
            <aside className="hidden min-w-0 space-y-6 xl:block">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  AI Review Insights
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Turn customer feedback into actionable ideas.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <AIInsightsPanel
                  planType={planType}
                  businessSlug={businessSlug}
                  insights={insights}
                  loadingInsights={loadingInsights}
                />
              </motion.div>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

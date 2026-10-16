import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import PageHeader from "../../layouts/PageHeader";

import { mockGoogleReviews } from "./mockGoogleReviews";
import ReviewDrawer from "./ReviewDrawer";
import ReviewsFilters from "./ReviewFilters";
import ReviewsList from "./ReviewList";
import ReviewsTabs from "./ReviewTabs";

const API_BASE = "https://reviewqrapi.onrender.com/api";

const VALID_TABS = ["all", "google", "internal"];

function getErrorMessage(error) {
  if (error?.name === "AbortError") return "";
  if (error instanceof TypeError) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }
  return error?.message || "Something went wrong while loading reviews.";
}

function getReviewDate(review) {
  const date = new Date(
    review?.created_at || review?.published_at || review?.date || 0
  ).getTime();

  return Number.isFinite(date) ? date : 0;
}

function matchesSearch(review, query) {
  if (!query) return true;

  const searchableText = [
    review?.reviewer_name,
    review?.author_name,
    review?.name,
    review?.comment,
    review?.text,
    review?.review_text,
    review?.email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query.toLowerCase());
}

export default function Reviews() {
  const { token, setApiOffline, setApiBackendError } = useAuth();

  const {
    businessSlug,
    markGoogleReviewsAsRead,
    setUnreadGoogleReviews,
  } = useApp();

  const { business } = useParams();
  const location = useLocation();

  const initialTab = new URLSearchParams(location.search).get("tab");
  const normalizedInitialTab = VALID_TABS.includes(initialTab)
    ? initialTab
    : "all";

  const [internalReviews, setInternalReviews] = useState([]);
  const [googleReviews] = useState(
    Array.isArray(mockGoogleReviews) ? mockGoogleReviews : []
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(normalizedInitialTab);
  const [selectedReview, setSelectedReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const requestIdRef = useRef(0);
  const normalizedSearch = search.trim();

  // Keep the selected tab in sync with browser navigation and query parameters.
  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get("tab");
    setActiveTab(VALID_TABS.includes(queryTab) ? queryTab : "all");
  }, [location.search]);

  // Update the unread count using the currently available Google review data.
  useEffect(() => {
    setUnreadGoogleReviews?.(googleReviews.length);
  }, [googleReviews, setUnreadGoogleReviews]);

  // Fetch internal reviews. A request ID prevents older responses from
  // overwriting results for a newer search or filter selection.
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    async function fetchInternalReviews() {
      setLoading(true);
      setErrorMessage("");

      try {
        const params = new URLSearchParams();

        if (normalizedSearch) {
          params.set("q", normalizedSearch);
        }

        if (filter === "public") {
          params.set("public", "true");
        } else if (filter === "private") {
          params.set("public", "false");
        } else if (filter === "mobile" || filter === "desktop") {
          params.set("device", filter);
        }

        const queryString = params.toString();
        const endpoint = `${API_BASE}/reviews/search/${
          queryString ? `?${queryString}` : ""
        }`;

        const response = await fetch(endpoint, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          if ([401, 403, 500, 502, 503, 504].includes(response.status)) {
            setApiBackendError?.(true);
          }

          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Your session may have expired. Please sign in again."
            );
          }

          throw new Error(`Unable to load reviews (HTTP ${response.status}).`);
        }

        const json = await response.json();

        if (cancelled || requestId !== requestIdRef.current) return;

        const results = Array.isArray(json)
          ? json
          : Array.isArray(json?.results)
            ? json.results
            : [];

        setInternalReviews(results);
        setStatusMessage(json?.status_message || "");
      } catch (error) {
        if (cancelled || requestId !== requestIdRef.current) return;

        console.error("Review search error:", error);

        const message = getErrorMessage(error);
        setErrorMessage(message);

        if (
          error instanceof TypeError ||
          /network|failed to fetch|timeout/i.test(error?.message || "")
        ) {
          setApiOffline?.(true);
        }
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    fetchInternalReviews();

    return () => {
      cancelled = true;
    };
  }, [
    normalizedSearch,
    filter,
    token,
    setApiOffline,
    setApiBackendError,
  ]);

  // Mark Google reviews as read when the Google tab becomes active.
  useEffect(() => {
    if (activeTab !== "google" || !token || !businessSlug) return;

    let cancelled = false;

    async function markRead() {
      try {
        const response = await fetch(
          `${API_BASE}/business/${businessSlug}/google-reviews/mark-read/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              last_seen_google_review: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          if ([401, 403, 500, 502, 503, 504].includes(response.status)) {
            setApiBackendError?.(true);
          }

          throw new Error(`Mark-read request failed (HTTP ${response.status}).`);
        }

        if (!cancelled) {
          markGoogleReviewsAsRead?.();
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Google mark-read error:", error);

        if (
          error instanceof TypeError ||
          /network|failed to fetch|timeout/i.test(error?.message || "")
        ) {
          setApiOffline?.(true);
        }
      }
    }

    markRead();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    token,
    businessSlug,
    markGoogleReviewsAsRead,
    setApiOffline,
    setApiBackendError,
  ]);

  // Apply search consistently to Google reviews, which currently come from
  // mock data, and combine the results according to the selected tab.
  const visibleGoogleReviews = useMemo(() => {
    return googleReviews.filter((review) =>
      matchesSearch(review, normalizedSearch)
    );
  }, [googleReviews, normalizedSearch]);

  const reviewsToShow = useMemo(() => {
    if (activeTab === "google") {
      return visibleGoogleReviews;
    }

    if (activeTab === "internal") {
      return internalReviews;
    }

    return [...visibleGoogleReviews, ...internalReviews].sort(
      (a, b) => getReviewDate(b) - getReviewDate(a)
    );
  }, [activeTab, visibleGoogleReviews, internalReviews]);

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setSelectedReview(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSelectedReview(null);
  };

  const handleTabChange = (nextTab) => {
    if (!VALID_TABS.includes(nextTab)) return;

    setActiveTab(nextTab);
    setSelectedReview(null);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50/80 pb-24">
      <PageHeader businessName={business} title="All Reviews" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-5 sm:px-6 sm:pt-8">
        {/* Page introduction */}
        <div className="flex flex-col gap-1">
          <p className="text-sm leading-6 text-gray-500">
            Keep track of customer feedback and explore your reviews in one place.
          </p>
        </div>

        {/* Review source tabs */}
        <div>
          <ReviewsTabs active={activeTab} onChange={handleTabChange} />
        </div>

        {/* Search */}
        <div className="sticky top-[68px] z-30 md:static">
          <label
            htmlFor="reviews-search"
            className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/95 px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10"
          >
            <MagnifyingGlassIcon
              className="h-5 w-5 shrink-0 text-gray-400"
              aria-hidden="true"
            />

            <input
              id="reviews-search"
              type="search"
              placeholder="Search reviews, comments, or customers..."
              value={search}
              onChange={handleSearchChange}
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Clear
              </button>
            )}
          </label>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="text-sm font-semibold text-gray-800">
              Filter reviews
            </h2>

            {filter !== "all" && (
              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className="text-xs font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                Clear filters
              </button>
            )}
          </div>

          <ReviewsFilters filter={filter} setFilter={handleFilterChange} />

          {activeTab !== "google" && (
            <p className="px-1 text-xs leading-5 text-gray-400">
              Visibility and device filters apply to internal reviews.
            </p>
          )}
        </div>

        {/* API error */}
        {errorMessage && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-red-800">
                Couldn't load internal reviews
              </p>
              <p className="mt-1 text-sm leading-5 text-red-700">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setFilter((current) => {
                  // Trigger a new request without changing the selected filter.
                  setLoading(true);
                  return current;
                });
              }}
              className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Optional backend status */}
        {statusMessage && !errorMessage && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {statusMessage}
          </p>
        )}

        {/* Reviews */}
        {loading && activeTab !== "google" ? (
          <div
            className="space-y-3"
            role="status"
            aria-live="polite"
            aria-label="Loading reviews"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-gray-100" />
                    <div className="h-3 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="mt-5 h-3 w-full rounded bg-gray-100" />
                <div className="mt-2 h-3 w-3/4 rounded bg-gray-100" />
              </div>
            ))}
            <span className="sr-only">Loading reviews...</span>
          </div>
        ) : (
          <ReviewsList
            reviews={reviewsToShow}
            onSelect={setSelectedReview}
          />
        )}

        {!loading && !errorMessage && reviewsToShow.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            Showing {reviewsToShow.length}{" "}
            {reviewsToShow.length === 1 ? "review" : "reviews"}
          </p>
        )}
      </main>

      <ReviewDrawer
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}
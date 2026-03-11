import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { mockGoogleReviews } from "./mockGoogleReviews";
import ReviewDrawer from "./ReviewDrawer";
import ReviewsFilters from "./ReviewFilters";
import ReviewsList from "./ReviewList";
import ReviewsTabs from "./ReviewTabs";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import PageHeader from "../../layouts/PageHeader";
import { fetchWithTimeout } from "../../utils/FetchWithTimer";


export default function Reviews() {
  const { token, setApiOffline, setApiBackendError } = useAuth();

  const [internalReviews, setInternalReviews] = useState([]);
  const [googleReviews, setGoogleReviews] = useState(mockGoogleReviews);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "all";

  const [activeTab, setActiveTab] = useState(initialTab);

  const { business } = useParams();
  console.log(activeTab)


  const { businessSlug, markGoogleReviewsAsRead, setUnreadGoogleReviews } = useApp();



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || "all";
    setActiveTab(tab);
  }, [location.search]);



  useEffect(() => {
    setUnreadGoogleReviews(mockGoogleReviews.length);
  }, []);

  // useEffect(() => {
  //   if (activeTab === "google") {
  //     markGoogleReviewsAsRead();

  //     fetch(`https://reviewqrapi.onrender.com/api/business/${businessSlug}/google-reviews/mark-read/`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         last_seen_google_review: new Date().toISOString()
  //       })
  //     });
  //   }
  // }, [activeTab]);

  useEffect(() => {
    async function markRead() {
      try {
        const response = await fetchWithTimeout(
          `https://reviewqrapi.onrender.com/api/business/${businessSlug}/google-reviews/mark-read/`,
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

        // 🔥 Backend reachable but failing
        if (!response.ok) {
          if ([401, 403, 500, 503].includes(response.status)) {
            setApiBackendError(true);
          }
          throw new Error("API error");
        }

      } catch (err: any) {
        console.error("Google mark-read error:", err);

        // 🔥 Network unreachable / CORS / timeout
        if (
          err.message.includes("Network") ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("timeout")
        ) {
          setApiOffline(true);
        }
      }
    }

    if (activeTab === "google") {
      markGoogleReviewsAsRead();
      markRead();
    }
  }, [activeTab]);


  useEffect(() => {
    fetchInternalReviews();
  }, [search, filter]);

  async function fetchInternalReviews() {
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (filter === "public") params.append("public", "true");
      if (filter === "private") params.append("public", "false");
      if (filter === "mobile") params.append("device", "mobile");
      if (filter === "desktop") params.append("device", "desktop");

      const response = await fetch(
        `https://reviewqrapi.onrender.com/api/reviews/search/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔥 Backend reachable but failing
      if (!response.ok) {
        if ([401, 403, 500, 503].includes(response.status)) {
          setApiBackendError(true);
        }
        throw new Error("API error");
      }

      const json = await response.json();

      setInternalReviews(json.results || []);
      setStatusMessage(json.status_message);

    } catch (err: any) {
      console.error("Review search error:", err);

      // 🔥 Network unreachable / CORS / timeout
      if (
        err.message.includes("Network") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("timeout")
      ) {
        setApiOffline(true);
      }

    } finally {
      setLoading(false);
    }
  }


  const combinedReviews = useMemo(() => {
    if (activeTab === "google") return googleReviews;
    if (activeTab === "internal") return internalReviews;

    return [...googleReviews, ...internalReviews].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [activeTab, googleReviews, internalReviews]);

  const reviewsToShow = useMemo(() => {
    // If searching, only show internal search results
    if (search.trim().length > 0) {
      return internalReviews;
    }

    // Otherwise use the normal tab logic
    return combinedReviews;
  }, [search, internalReviews, combinedReviews]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading reviews…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

      {/* Premium Mobile/Desktop Header */}
      <PageHeader businessName={business} title="All Reviews" />

      {/* Mobile-safe wrapper */}
      <div className="
        px-4 pt-5 pb-24
        w-full max-w-xl md:max-w-4xl
        mx-auto flex flex-col gap-8
      ">

        {/* Tabs — mobile premium spacing */}
        <div className="mt-2">
          <ReviewsTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Mobile-native Search Bar */}
        <div
          className="
    sticky top-[68px] z-30
    md:static md:top-auto
  "
        >
          <div
            className="
      md:hidden
      flex items-center gap-3
      px-4 py-2.5
      rounded-full
      bg-white/70 
      backdrop-blur-2xl
      border border-gray-200/60 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_8px_rgba(0,0,0,0.06)]
      transition-all
      active:scale-[.98]
    "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500 "
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search"
              className="
        flex-1 bg-transparent outline-none
        text-[15px] placeholder:text-gray-400 
      "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Desktop version stays exactly the same */}
          <div className="hidden md:block">
            <div
              className="
        bg-white/90 backdrop-blur-xl
        rounded-2xl border border-gray-200 shadow-sm
        flex items-center gap-3
        px-4 py-3
      "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search reviews…"
                className="
          flex-1 bg-transparent outline-none
          text-[15px] placeholder:text-gray-400
        "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters — mobile glass card */}
        <div className="mt-1">
          <ReviewsFilters filter={filter} setFilter={setFilter} />
        </div>

        {/* Review List — mobile spacing */}
        <div className="mt-2">
          <ReviewsList
            reviews={reviewsToShow}
            onSelect={setSelectedReview}
          />
        </div>

        {/* Drawer stays the same */}
        <ReviewDrawer
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />

      </div>
    </div>
  );
}



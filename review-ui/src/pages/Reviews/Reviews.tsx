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


export default function Reviews() {
  const { token } = useAuth();

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


const { businessSlug, markGoogleReviewsAsRead,setUnreadGoogleReviews } = useApp();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "all";
  setActiveTab(tab);
}, [location.search]);



useEffect(() => {
  setUnreadGoogleReviews(mockGoogleReviews.length);
}, []);

useEffect(() => {
  if (activeTab === "google") {
    markGoogleReviewsAsRead();

    fetch(`https://reviewqrapi.onrender.com/api/business/${businessSlug}/google-reviews/mark-read/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json" },
      body: JSON.stringify({
        last_seen_google_review: new Date().toISOString()
      })
    });
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

    const res = await fetch(
      `https://reviewqrapi.onrender.com/api/reviews/search/?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const json = await res.json();

    if (json.count === 0) {
      setInternalReviews(json.results || []);
      setStatusMessage(json.status_message);
    } else {
      setInternalReviews(json.results || []);
      setStatusMessage(json.status_message);
    }
  } catch (err) {
    console.error("Review search error:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading reviews…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

<PageHeader businessName={business} title="All Reviews" />
      <div className="p-5 max-w-3xl mx-auto">

        <ReviewsTabs active={activeTab} onChange={setActiveTab} />

        <input
          type="text"
          placeholder="Search reviews…"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ReviewsFilters filter={filter} setFilter={setFilter} />

        <ReviewsList
          reviews={combinedReviews}
          onSelect={setSelectedReview}
        />

        <ReviewDrawer
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      </div>
    </div>
  );
}



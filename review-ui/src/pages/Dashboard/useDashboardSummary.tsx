import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export function useDashboardSummary() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastGoogleReview, setLastGoogleReview] = useState("");
  const { unreadGoogleReviews, markGoogleReviewsAsRead } = useApp();

  const { setBusinessSlug } = useApp();
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard/summary/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        setData(json);
        setBusinessSlug(json.business_slug);
        setLastGoogleReview(json.last_google_review_date)
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);
  console.log(lastGoogleReview)

  return { data, loading,lastGoogleReview };
}
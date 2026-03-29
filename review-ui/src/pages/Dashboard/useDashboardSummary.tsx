import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { fetchWithTimeout } from "../../utils/FetchWithTimer";

export function useDashboardSummary(location) {
  const { token, setApiOffline, setApiBackendError } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastGoogleReview, setLastGoogleReview] = useState("");
  const { setBusinessSlug, setBusinessName } = useApp();

  console.log(location)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const url = location
          ? `https://reviewqrapi.onrender.com/api/dashboard/summary/?location=${encodeURIComponent(location)}`
          : `https://reviewqrapi.onrender.com/api/dashboard/summary/`;

        const response = await fetchWithTimeout(
          url,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
          15000
        );

        if (!response.ok) {
          if ([401, 403, 500, 503].includes(response.status)) {
            setApiBackendError(true);
          }
          throw new Error("API error");
        }

        const json = await response.json();
        setData(json);
        setBusinessSlug(json.business_slug);
        setBusinessName(json.business_name);
        setLastGoogleReview(json.last_google_review_date);

      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (
          err.message === "timeout" ||
          err.message.includes("Network") ||
          err.message.includes("Failed to fetch")
        ) {
          setApiOffline(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token, location]);



  return { data, loading, lastGoogleReview };
}
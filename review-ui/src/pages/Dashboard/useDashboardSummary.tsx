import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export function useDashboardSummary() {
  const { token, setApiOffline,setApiBackendError } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastGoogleReview, setLastGoogleReview] = useState("");
  const { setBusinessSlug, setBusinessName } = useApp();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(
          "https://reviewqrapi.onrender.com/api/dashboard/summary/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 🔥 Backend reachable but failing
        if (!response.ok) {
          if ([401, 403, 500, 503].includes(response.status)) {
            setApiBackendError(true)
          }
          throw new Error("API error")
        }

        const json = await response.json();
        setData(json);
        setBusinessSlug(json.business_slug);
        setBusinessName(json.business_name);
        setLastGoogleReview(json.last_google_review_date);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);

        // 🔥 Detect network failure / CORS / timeout
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

    fetchDashboard();
  }, [token]);

  return { data, loading, lastGoogleReview };
}
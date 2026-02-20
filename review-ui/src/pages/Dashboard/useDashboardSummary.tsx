import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function useDashboardSummary() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("https://reviewqrapi.onrender.com/api/dashboard/summary/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);

  return { data, loading };
}
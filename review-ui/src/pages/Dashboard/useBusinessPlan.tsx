import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export function useBusinessPlan() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, setApiOffline, setApiBackendError } = useAuth();
  const { planType,setPlanType } = useApp();


  const fetchPlan = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/updatePlan/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch plan");

      const data = await res.json();
      setPlanType(data.plan_type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (newPlanType) => {
    try {
      const res = await fetch("/api/business/update-plan/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_type: newPlanType }),
      });

      if (!res.ok) throw new Error("Failed to update plan");

      const data = await res.json();
      setPlanType(data.plan_type);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (token) fetchPlan();
  }, [token]);

  return { planType, loading, error, updatePlan };
}
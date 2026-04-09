import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useBusinessPlan } from "./useBusinessPlan";


export default function PlanBadge() {
  const { planType, loading } = useBusinessPlan();

  if (loading) {
    return (
      <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-600">
        Loading…
      </span>
    );
  }

  if (!planType) {
    return (
      <span className="px-3 py-1 text-sm rounded-full bg-gray-300 text-gray-700">
        No Plan
      </span>
    );
  }

  const colorMap = {
    free: "bg-gray-200 text-gray-700",
    starter: "bg-blue-200 text-blue-800",
    pro: "bg-purple-200 text-purple-800",
    premium: "bg-yellow-200 text-yellow-800",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${colorMap[planType]}`}
    >
      {planType.toUpperCase()}
    </span>
  );
}
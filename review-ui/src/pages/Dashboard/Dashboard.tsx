import AppLayout from "../../layouts/AppLayout";
import DashboardContent from "./DashboardContent";
import DashboardSkeleton from "./DashboardSkeleton";
import { useDashboardSummary } from "./useDashboardSummary";
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { mockGoogleReviews } from "../Reviews/mockGoogleReviews";


export default function Dashboard() {
  const { data, loading, lastGoogleReview } = useDashboardSummary();

  const { setUnreadGoogleReviews } = useApp();

  console.log(lastGoogleReview)


  useEffect(() => {
    async function loadGoogleReviews() {
      // 1. Use your mock data for now
      const reviews = mockGoogleReviews;

      // 2. If user has never viewed Google reviews, everything is "new"
      if (!lastGoogleReview) {
        setUnreadGoogleReviews(reviews.length);
        return;
      }

      // 3. Convert last seen timestamp
      const lastSeenDate = new Date(lastGoogleReview);

      // 4. Compare timestamps
      const newOnes = reviews.filter(review => {
        return new Date(review.created_at) > lastSeenDate;
      });

      // 5. Update unread count
      setUnreadGoogleReviews(newOnes.length);

      // Debugging (optional but helpful)
      console.log("Last seen:", lastGoogleReview);
      console.log("New reviews:", newOnes);
    }

    loadGoogleReviews();
  }, [lastGoogleReview]);

  if (loading || !data) return <DashboardSkeleton />;

  return (
    <AppLayout slug={data.business_slug}>
      <DashboardContent data={data} />
    </AppLayout>
  );
}
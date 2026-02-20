import AppLayout from "../../layouts/AppLayout";
import DashboardContent from "./DashboardContent";
import DashboardSkeleton from "./DashboardSkeleton";
import { useDashboardSummary } from "./useDashboardSummary";

export default function Dashboard() {
    const { data, loading } = useDashboardSummary();
  
    if (loading || !data) return <DashboardSkeleton />;
  
    return (
      <AppLayout slug={data.business_slug}>
        <DashboardContent data={data} />
      </AppLayout>
    );
  }
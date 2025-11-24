import { KPICard } from "./KPICard";
import { Users, Upload, TrendingUp, CheckCircle } from "lucide-react";

interface DashboardOverviewProps {
  metrics: {
    total_resumes?: number;
    candidates_invited?: number;
    interviews_completed?: number;
    pending_expired?: number;
  };
  loading: boolean;
}

export function DashboardOverview({
  metrics,
  loading,
}: DashboardOverviewProps) {
  const kpiData = [
    {
      title: "Total Resumes",
      value: String(metrics.total_resumes || 0),
      icon: Upload,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Candidates Invited",
      value: String(metrics.candidates_invited || 0),
      icon: Users,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Interviews Completed",
      value: String(metrics.interviews_completed || 0),
      icon: CheckCircle,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Pending / Expired",
      value: String(metrics.pending_expired || 0),
      icon: TrendingUp,
      trend: "-3%",
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {kpiData.map((kpi, i) => (
        <KPICard key={i} {...kpi} />
      ))}
    </div>
  );
}

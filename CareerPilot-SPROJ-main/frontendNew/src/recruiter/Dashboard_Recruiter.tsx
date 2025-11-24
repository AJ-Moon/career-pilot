import { useState, useCallback, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate, useParams, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DashboardOverview } from "./DashboardOverview";
import CandidateUpload from "./UploadResumes";
import { JobPositionsGrid } from "./JobPositionsGrid";
import { AllCandidates } from "./AllCandidates";
import { JobSetup } from "./JobSetup";
import { Reports } from "./Reports";
import { NotificationSettings } from "./NotificationSettings";
import { ActivityTimeline } from "./ActivityTimeline";
import { WeeklyActivityChart } from "./WeeklyActivityChart";
import { CandidateStatusChart } from "./CandidateStatusChart";
import { InterviewCompletionChart } from "./InterviewCompletionChart";
import { HighScoringCandidates } from "./HighScoringCandidates";
import { BatchProgress } from "./BatchProgress";
import { KanbanBoard } from "./KanbanBoard";
import { JobPosition } from "./JobPosition";
import { apiFetch } from "../api/fetchClient";
import { CheckCircle, UserCheck, LogOut } from "lucide-react";
import type { TimelineItem } from "./ActivityTimeline";
import type { Page } from "./types";

export function Dashboard_recruiter() {
  const clerk = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.fullName || "Anonymous";

  const [metrics, setMetrics] = useState<any>({});
  const [activity, setActivity] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sidebar navigation handler
  const handleNavigate = (page: Page, jobId?: string) => {
    switch (page) {
      case "dashboard": navigate("/recruiter/dashboard"); break;
      case "upload": navigate("/recruiter/upload"); break;
      case "candidates": navigate("/recruiter/candidates"); break;
      case "job": navigate("/recruiter/job"); break;
      case "job-setup":
        if (jobId) navigate(`/recruiter/job/setup/${jobId}`);
        else navigate("/recruiter/job/setup");
        break;
      case "job-position":
        if (jobId) navigate(`/recruiter/job/positions/${jobId}`);
        break;
      case "reports": navigate("/recruiter/reports"); break;
      case "settings": navigate("/recruiter/settings"); break;
      default: navigate("/recruiter/dashboard");
    }
  };

  // Derive current page for sidebar highlighting
  // const getCurrentPage = (): Page => {
  //   if (location.pathname.includes("/recruiter/upload")) return "upload";
  //   if (location.pathname.includes("/recruiter/candidates")) return "candidates";
  //   if (location.pathname.includes("/recruiter/job")) return "job";
  //   if (location.pathname.includes("/recruiter/reports")) return "reports";
  //   if (location.pathname.includes("/recruiter/settings")) return "settings";
  //   return "dashboard";
  // };
  const getCurrentPage = (): Page => {
    if (location.pathname.includes("/recruiter/upload")) return "upload";
    if (location.pathname.includes("/recruiter/candidates")) return "candidates";
    if (location.pathname.includes("/recruiter/job/setup")) return "job-setup";
    if (location.pathname.includes("/recruiter/job")) return "job"; // grid/list
    if (location.pathname.includes("/recruiter/reports")) return "reports";
    if (location.pathname.includes("/recruiter/settings")) return "settings";
    return "dashboard";
  };
  

  // Fetch dashboard metrics & activity once
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsData, activityData] = await Promise.all([
        apiFetch("/api/recruiter/dashboard/metrics"),
        apiFetch("/api/recruiter/dashboard/activity/recent"),
      ]);
      setMetrics(metricsData);
      const timeline: TimelineItem[] = activityData.map((a: any, i: number) => ({
        id: i + 1,
        type: a.interview_completed ? "completed" : "invited",
        icon: a.interview_completed ? CheckCircle : UserCheck,
        color: a.interview_completed ? "#34D399" : "#38BDF8",
        title: a.interview_completed ? "Interview Completed" : "Interview Invite Sent",
        description: a.email,
        time: new Date(a.time).toLocaleString(),
      }));
      setActivity(timeline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleLogout = async () => {
    await clerk.signOut();
    navigate("/");
  };

  // Wrappers to extract jobId from URL
  function JobSetupWrapper() {
    const { jobId } = useParams<{ jobId: string }>();
    return <JobSetup onBack={() => navigate("/recruiter/job")} jobId={jobId} />;
  }

  function JobPositionWrapper() {
    const { jobId } = useParams<{ jobId: string }>();
    return <JobPosition jobId={jobId!} onBack={() => navigate("/recruiter/job")} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="flex-1 p-6 overflow-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">CareerPilot</h1>
            <h2 className="text-lg text-gray-600">AI Mock Interview</h2>
            <p className="mt-2 font-medium">{userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <Routes>
          <Route path="dashboard" element={
            <>
              <DashboardOverview metrics={metrics} loading={loading} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <InterviewCompletionChart />
                <CandidateStatusChart />
                <WeeklyActivityChart />
              </div>
              <ActivityTimeline activity={activity} loading={loading} />
              <HighScoringCandidates />
              <BatchProgress />
              <KanbanBoard />
            </>
          } />
          <Route path="upload" element={<CandidateUpload />} />
          <Route path="candidates" element={<AllCandidates />} />

          {/* Job workflow */}
          <Route path="job" element={<JobPositionsGrid />} />
          <Route path="job/setup" element={<JobSetup onBack={() => navigate("/recruiter/job")} />} />
          <Route path="job/setup/:jobId" element={<JobSetupWrapper />} />
          <Route path="job/positions/:jobId" element={<JobPositionWrapper />} />

          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<NotificationSettings />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

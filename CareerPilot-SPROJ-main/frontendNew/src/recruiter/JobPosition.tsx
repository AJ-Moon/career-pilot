import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { KanbanBoard } from "./KanbanBoard";
import { apiFetch } from "../api/fetchClient";
import { useNavigate } from "react-router-dom";

interface JobPositionProps {
  jobId: string | null;
  onBack: () => void;
}

interface JobData {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  createdAt: string;
  isActive?: boolean;
}

interface CandidateStats {
  total: number;
  invited: number;
  completed: number;
  in_progress: number;
}

export function JobPosition({ jobId, onBack }: JobPositionProps) {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [stats, setStats] = useState<CandidateStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) return;

    const fetchJobAndCandidates = async () => {
      try {
        const job = await apiFetch(`/api/jobs/${jobId}`);
        setJobData(job);
        setIsActive(job.isActive ?? true);

        const candStats = await apiFetch(`/api/jobs/${jobId}/candidates`);
        setStats({
          total: candStats.total,
          invited: candStats.invited,
          completed: candStats.completed,
          in_progress: candStats.in_progress,
        });
      } catch (err) {
        console.error("Failed to fetch job or candidates:", err);
      }
    };

    fetchJobAndCandidates();
  }, [jobId]);

  if (!jobData) return <p>Loading...</p>;

  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked);
    try {
      await apiFetch(`/api/jobs/${jobId}/toggle_active`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      });
    } catch (err) {
      console.error("Failed to toggle active state:", err);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-[#6B7280] hover:bg-[#F3F4F6]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job List
        </Button>
      </div>

      {/* Job Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-[#1F2937] text-xl font-semibold">{jobData.title}</h2>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={handleToggleActive} />
                <span className="text-sm text-[#6B7280]">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">{jobData.description}</p>
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span>Created: {new Date(jobData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {jobData.skills.map((skill) => (
                <Badge key={skill} className="bg-[#0E7490] text-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 🔹 Big Action Buttons */}
        <div className="flex gap-6 mt-6">
          <Button
            onClick={() => navigate(`/recruiter/upload?jobId=${jobId}`)}
            className="flex-1 bg-[#0E7490] hover:bg-[#0E7490]/90 text-white py-6 text-lg"
          >
            Upload Resumes for this Job
          </Button>
          <Button
            onClick={() => navigate("/recruiter/job")}
            variant="outline"
            className="flex-1 border-[#D1D5DB] text-[#1F2937] py-6 text-lg"
          >
            Back to Job List
          </Button>
        </div>
      </div>

      {/* Candidate Pipeline */}
      <div>
        <h3 className="text-[#1F2937] mb-4">Candidate Pipeline</h3>

        {/* Summary counts */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-white border">
              <div className="text-lg text-[#1E293B]">{stats.invited}</div>
              <div className="text-xs text-[#6B7280]">Invited</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white border">
              <div className="text-lg text-[#1E293B]">{stats.in_progress}</div>
              <div className="text-xs text-[#6B7280]">In Progress</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white border">
              <div className="text-lg text-[#34D399]">{stats.completed}</div>
              <div className="text-xs text-[#6B7280]">Completed</div>
            </div>
          </div>
        )}

        <KanbanBoard jobId={jobId} />
      </div>
    </div>
  );
}

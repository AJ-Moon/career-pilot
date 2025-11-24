import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Eye } from "lucide-react";
import { apiFetch } from "../api/fetchClient";

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  score?: number | null;
  status: string;
}

interface KanbanBoardProps {
  jobId?: string | null;
}

export function KanbanBoard({ jobId }: KanbanBoardProps) {
  const stages = [
    { name: "Uploaded", color: "#6B7280", bgColor: "#6B7280" },
    { name: "Invited", color: "#38BDF8", bgColor: "#38BDF8" },
    { name: "In Progress", color: "#6366F1", bgColor: "#6366F1" },
    { name: "Completed", color: "#34D399", bgColor: "#34D399" },
    { name: "Reviewed", color: "#0E7490", bgColor: "#0E7490" },
    { name: "Shortlisted", color: "#10B981", bgColor: "#10B981" },
  ];

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    if (!jobId) return;

    const fetchCandidates = async () => {
      try {
        const data = await apiFetch(`/api/jobs/${jobId}/candidates`);
        setCandidates(data.candidates || []);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const getCandidatesByStage = (stageName: string) => {
    return candidates.filter((c) => {
      // Map backend status to stage names
      switch (c.status) {
        case "Invited":
          return stageName === "Invited";
        case "In Progress":
          return stageName === "In Progress";
        case "Completed":
          return stageName === "Completed";
        case "Shortlisted":
          return stageName === "Shortlisted";
        case "Reviewed":
          return stageName === "Reviewed";
        default:
          return stageName === "Uploaded";
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-[#10B981] to-[#34D399]";
    if (score >= 80) return "from-[#0E7490] to-[#38BDF8]";
    if (score >= 70) return "from-[#6366F1] to-[#A78BFA]";
    return "from-[#6B7280] to-[#9CA3AF]";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.08)] p-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageCandidates = getCandidatesByStage(stage.name);

          return (
            <div key={stage.name} className="flex-shrink-0 w-80">
              <div
                className="rounded-xl px-4 py-3.5 mb-4 text-white shadow-sm"
                style={{ backgroundColor: stage.bgColor }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">{stage.name}</h4>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                    {stageCandidates.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {stageCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="group bg-gradient-to-br from-[#F9FAFB] to-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)] hover:shadow-md transition-all cursor-move hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm text-[#1E293B] mb-1 truncate">
                          {candidate.full_name}
                        </h5>
                        <p className="text-xs text-[#6B7280] truncate">
                          {candidate.email}
                        </p>
                      </div>
                      {candidate.score !== null && candidate.score !== undefined && (
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getScoreColor(
                            candidate.score
                          )} flex items-center justify-center text-white text-xs shadow-sm ml-2 flex-shrink-0`}
                        >
                          {candidate.score}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-[#0E7490] hover:bg-[#0E7490]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-3 h-3 mr-1.5" />
                      View Details
                    </Button>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl text-[#6B7280]">—</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">No candidates</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

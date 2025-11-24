import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CandidateProfileModal } from "./CandidateProfileModal";

export function HighScoringCandidates() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const candidates = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      score: 92,
      tag: "Technical",
      jobRole: "Software Engineer",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.c@email.com",
      score: 88,
      tag: "Communication",
      jobRole: "ML Engineer",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      score: 90,
      tag: "Confidence",
      jobRole: "Software Engineer",
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.k@email.com",
      score: 86,
      tag: "Technical",
      jobRole: "QA Analyst",
    },
  ];

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Technical":
        return "bg-[#0E7490] text-white";
      case "Communication":
        return "bg-[#38BDF8] text-white";
      case "Confidence":
        return "bg-[#34D399] text-white";
      default:
        return "bg-[#6B7280] text-white";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[#1F2937] mb-1">High-Scoring Candidates</h3>
            <p className="text-sm text-[#6B7280]">
              Top performers from recent interviews
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-[#6B7280]">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm text-[#6B7280]">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm text-[#6B7280]">
                  Score
                </th>
                <th className="text-left py-3 px-4 text-sm text-[#6B7280]">
                  Strength
                </th>
                <th className="text-right py-3 px-4 text-sm text-[#6B7280]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-b border-gray-100 hover:bg-[#F9FAFB]"
                >
                  <td className="py-4 px-4 text-sm text-[#1F2937]">
                    {candidate.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#6B7280]">
                    {candidate.email}
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center text-white text-sm">
                        {candidate.score}
                      </div>
                      <span className="text-sm text-[#6B7280]">%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getTagColor(candidate.tag)}>
                      {candidate.tag}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCandidate(candidate)}
                      className="text-[#0E7490] hover:bg-[#0E7490] hover:bg-opacity-10"
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
}

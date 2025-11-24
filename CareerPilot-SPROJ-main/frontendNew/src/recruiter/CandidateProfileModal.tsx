import {
  X,
  Download,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Video,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

interface CandidateProfileModalProps {
  candidate: any;
  onClose: () => void;
}

export function CandidateProfileModal({
  candidate,
  onClose,
}: CandidateProfileModalProps) {
  const scoreBreakdown = {
    technical: 90,
    communication: 88,
    confidence: 92,
    problemSolving: 87,
  };

  const questions = [
    {
      question:
        "Describe your experience with React and modern web development.",
      answer:
        "I have over 3 years of experience working with React, building scalable applications...",
      evaluation: "Strong understanding of React concepts and best practices.",
      score: 92,
    },
    {
      question: "How do you handle code reviews and collaborative development?",
      answer:
        "I believe code reviews are essential for maintaining quality. I focus on constructive feedback...",
      evaluation: "Excellent communication and teamwork skills demonstrated.",
      score: 90,
    },
    {
      question: "Tell me about a challenging technical problem you solved.",
      answer:
        "In my previous role, we faced a performance issue with our data processing pipeline...",
      evaluation:
        "Good problem-solving approach with clear examples and measurable outcomes.",
      score: 88,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)] bg-gradient-to-br from-[#F9FAFB] to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center text-white text-2xl shadow-lg">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-[#1E293B] mb-1">{candidate.name}</h2>
                <p className="text-sm text-[#6B7280]">{candidate.email}</p>
                <Badge className="mt-1 bg-gradient-to-r from-[#0E7490] to-[#38BDF8] text-white border-0">
                  {candidate.jobRole}
                </Badge>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 hover:bg-[#F3F4F6] rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#F3F4F6] p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="answers"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Answers
              </TabsTrigger>
              <TabsTrigger
                value="behavior"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Behavior
              </TabsTrigger>
              <TabsTrigger
                value="resume"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Resume
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-[#1E293B] mb-2">
                      Overall Interview Score
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      This candidate performed exceptionally well across all
                      evaluation criteria.
                    </p>
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center text-white text-3xl shadow-lg ml-6">
                    {candidate.score || 90}
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)] space-y-4">
                <h3 className="text-[#1E293B]">Score Breakdown</h3>

                {Object.entries(scoreBreakdown).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280] capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-sm text-[#1E293B]">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2.5" />
                  </div>
                ))}
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <h4 className="text-[#1E293B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#34D399] flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 text-white" />
                    </div>
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#34D399] mt-0.5">•</span>
                      <span>Strong technical knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#34D399] mt-0.5">•</span>
                      <span>Excellent communication skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#34D399] mt-0.5">•</span>
                      <span>Problem-solving ability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#34D399] mt-0.5">•</span>
                      <span>Team collaboration</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                  <h4 className="text-[#1E293B] mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                      <ThumbsDown className="w-4 h-4 text-white" />
                    </div>
                    Areas for Growth
                  </h4>
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>System design depth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Leadership experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Public speaking confidence</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-br from-[#6366F1]/5 to-[#A78BFA]/5 rounded-2xl p-6 border border-[#6366F1]/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A78BFA] flex items-center justify-center text-white flex-shrink-0">
                    ✨
                  </div>
                  <h4 className="text-[#1E293B] mt-1">AI-Generated Summary</h4>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {candidate.name} demonstrated strong technical competency
                  throughout the interview. Their responses showed deep
                  understanding of software engineering principles and best
                  practices. Communication was clear and articulate. The
                  candidate would be an excellent fit for the
                  {candidate.jobRole} position, particularly in collaborative
                  team environments.
                </p>
              </div>
            </TabsContent>

            {/* Answers Tab */}
            <TabsContent value="answers" className="space-y-5">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)] space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center text-white text-sm flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#1E293B] mb-2">
                          Question {index + 1}
                        </h4>
                        <p className="text-sm text-[#6B7280]">{q.question}</p>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#34D399] to-[#10B981] flex items-center justify-center text-white ml-4 flex-shrink-0 shadow-sm">
                      {q.score}
                    </div>
                  </div>

                  <div className="pl-13">
                    <div className="mb-3">
                      <span className="text-xs text-[#6B7280] uppercase tracking-wide">
                        Candidate Answer
                      </span>
                      <p className="text-sm text-[#1E293B] mt-2 leading-relaxed">
                        {q.answer}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-[rgba(0,0,0,0.08)]">
                      <span className="text-xs text-[#6B7280] uppercase tracking-wide">
                        AI Evaluation
                      </span>
                      <p className="text-sm text-[#34D399] mt-2">
                        {q.evaluation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="space-y-6">
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                  <h4 className="text-[#1E293B] mb-3">Voice Tone</h4>
                  <div className="text-3xl text-[#0E7490] mb-2">85%</div>
                  <p className="text-xs text-[#6B7280]">Confident and clear</p>
                  <Progress value={85} className="mt-3 h-2" />
                </div>

                <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                  <h4 className="text-[#1E293B] mb-3">Facial Expression</h4>
                  <div className="text-3xl text-[#34D399] mb-2">90%</div>
                  <p className="text-xs text-[#6B7280]">Engaged and positive</p>
                  <Progress value={90} className="mt-3 h-2" />
                </div>

                <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                  <h4 className="text-[#1E293B] mb-3">Confidence Level</h4>
                  <div className="text-3xl text-[#6366F1] mb-2">88%</div>
                  <p className="text-xs text-[#6B7280]">Very confident</p>
                  <Progress value={88} className="mt-3 h-2" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                <h4 className="text-[#1E293B] mb-5">Confidence Timeline</h4>
                <div className="h-56 flex items-end justify-between gap-2">
                  {[75, 82, 88, 85, 90, 92, 88, 91].map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-3"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-[#0E7490] to-[#38BDF8] rounded-t-lg shadow-sm transition-all hover:scale-105"
                        style={{ height: `${value}%` }}
                      ></div>
                      <span className="text-xs text-[#6B7280]">Q{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-[rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                    <Video className="w-5 h-5 text-[#6366F1]" />
                  </div>
                  <h4 className="text-[#1E293B]">Interview Recording</h4>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">
                  Full interview video available for review
                </p>
                <Button
                  variant="outline"
                  className="w-full border-[rgba(0,0,0,0.08)]"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Interview Recording
                </Button>
              </div>
            </TabsContent>

            {/* Resume Tab */}
            <TabsContent value="resume" className="space-y-6">
              <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-12 border border-[rgba(0,0,0,0.08)] text-center">
                <FileText className="w-20 h-20 text-[#0E7490] mx-auto mb-4" />
                <h4 className="text-[#1E293B] mb-2">Resume Document</h4>
                <p className="text-sm text-[#6B7280] mb-6">
                  resume_{candidate.id}.pdf • 245 KB
                </p>
                <Button className="bg-gradient-to-r from-[#0E7490] to-[#38BDF8] hover:opacity-90 text-white shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[rgba(0,0,0,0.08)] bg-[#F9FAFB] flex items-center justify-between gap-3">
          <div className="flex gap-3">
            <Button variant="outline" className="border-[rgba(0,0,0,0.08)]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button className="bg-gradient-to-r from-[#34D399] to-[#10B981] hover:opacity-90 text-white shadow-lg">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Shortlist Candidate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

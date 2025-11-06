import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import React from 'react';
import { 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Award,
  Eye,
  BarChart3,
  Brain,
  MessageSquare,
  Video,
  Mic
} from 'lucide-react';

interface CandidateScore {
  id: string;
  name: string;
  email: string;
  domain: string;
  interviewDate: string;
  overallScore: number;
  technicalScore: number;
  behavioralScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
}

export default function CandidateScores() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateScore | null>(null);

  const [candidates] = useState<CandidateScore[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      domain: 'Software Engineering',
      interviewDate: '2025-10-30',
      overallScore: 85,
      technicalScore: 88,
      behavioralScore: 82,
      communicationScore: 84,
      confidenceScore: 86,
      strengths: ['React expertise', 'Problem-solving', 'Clear communication'],
      weaknesses: ['System design', 'Database optimization']
    },
    {
      id: '2',
      name: 'David Park',
      email: 'david.park@email.com',
      domain: 'DevOps',
      interviewDate: '2025-10-29',
      overallScore: 92,
      technicalScore: 95,
      behavioralScore: 89,
      communicationScore: 91,
      confidenceScore: 93,
      strengths: ['Kubernetes expertise', 'Leadership skills', 'Strategic thinking'],
      weaknesses: ['Time management under pressure']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      domain: 'Software Engineering',
      interviewDate: '2025-11-01',
      overallScore: 78,
      technicalScore: 75,
      behavioralScore: 80,
      communicationScore: 79,
      confidenceScore: 78,
      strengths: ['Team collaboration', 'Adaptability', 'GraphQL knowledge'],
      weaknesses: ['Algorithm optimization', 'Public speaking']
    },
    {
      id: '4',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      domain: 'Data Science',
      interviewDate: '2025-10-28',
      overallScore: 88,
      technicalScore: 90,
      behavioralScore: 86,
      communicationScore: 87,
      confidenceScore: 89,
      strengths: ['Machine learning algorithms', 'Data visualization', 'Research methodology'],
      weaknesses: ['Production deployment', 'Communication of complex concepts']
    }
  ]);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const downloadReport = (candidateId: string) => {
    console.log('Downloading report for candidate:', candidateId);
    alert('PDF report downloaded successfully!');
  };

  const averageScore = candidates.reduce((acc, c) => acc + c.overallScore, 0) / candidates.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-1">Candidate Scores & Reports</h2>
        <p className="text-gray-600">
          View detailed performance analytics and download candidate reports
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Assessed</span>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl">{candidates.length}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Average Score</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl">{averageScore.toFixed(0)}%</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Top Performer</span>
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl">92%</div>
          <p className="text-gray-600 text-sm mt-1">David Park</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Reports Ready</span>
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl">{candidates.length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                selectedCandidate?.id === candidate.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="mb-1">{candidate.name}</h3>
                  <p className="text-gray-600 text-sm">{candidate.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {candidate.domain} • {new Date(candidate.interviewDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBgColor(candidate.overallScore)}`}>
                  <span className={`text-xl ${getScoreColor(candidate.overallScore)}`}>
                    {candidate.overallScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Technical:</span>
                  <span>{candidate.technicalScore}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Behavioral:</span>
                  <span>{candidate.behavioralScore}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mic className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Communication:</span>
                  <span>{candidate.communicationScore}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">Confidence:</span>
                  <span>{candidate.confidenceScore}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidate(candidate);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadReport(candidate.id);
                  }}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        <div className="sticky top-6 h-fit">
          {selectedCandidate ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="mb-1">{selectedCandidate.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedCandidate.domain}</p>
                </div>
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center ${getScoreBgColor(selectedCandidate.overallScore)}`}>
                  <span className={`text-2xl ${getScoreColor(selectedCandidate.overallScore)}`}>
                    {selectedCandidate.overallScore}
                  </span>
                  <span className="text-xs text-gray-600">Overall</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Technical Skills</span>
                    <span className="text-sm">{selectedCandidate.technicalScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedCandidate.technicalScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Behavioral Assessment</span>
                    <span className="text-sm">{selectedCandidate.behavioralScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedCandidate.behavioralScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Communication</span>
                    <span className="text-sm">{selectedCandidate.communicationScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedCandidate.communicationScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Confidence Level</span>
                    <span className="text-sm">{selectedCandidate.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedCandidate.confidenceScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {selectedCandidate.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {selectedCandidate.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => downloadReport(selectedCandidate.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Full Report
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2">Select a Candidate</h3>
              <p className="text-gray-600 text-sm">
                Click on a candidate card to view detailed performance analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="mb-2">No candidates found</h3>
          <p className="text-gray-600 text-sm">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}

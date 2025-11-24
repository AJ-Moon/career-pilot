import { Progress } from "../components/ui/progress";
import { ArrowRight, TrendingUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  resumes: number;
  interviewed: number;
  shortlisted: number;
  progress: number;
  gradient: string;
}

export function JobPositionsGrid() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5005/api/jobs");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        // Map backend jobs into frontend shape
        const mapped: Job[] = data.map((job: any) => ({
          id: job._id,
          title: job.title || "Untitled Job",
          resumes: job.resumesCount || 0,       // backend should expose counts
          interviewed: job.interviewedCount || 0,
          shortlisted: job.shortlistedCount || 0,
          progress: job.progress || 0,
          gradient: "from-[#0E7490] to-[#38BDF8]",
        }));

        setJobs(mapped);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobSetup = (jobId: string) => {
    navigate(`/recruiter/job/setup/${jobId}`);
  };

  const handleSeeJob = (jobId: string) => {
    navigate(`/recruiter/job/positions/${jobId}`);
  };

  const handleCreateJob = async () => {
    try {
      const res = await fetch("http://localhost:5005/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const newJobId = data.jobId;

      setJobs(prev => [
        ...prev,
        {
          id: newJobId,
          title: "New Job",
          resumes: 0,
          interviewed: 0,
          shortlisted: 0,
          progress: 0,
          gradient: "from-[#0E7490] to-[#38BDF8]",
        },
      ]);

      navigate(`/recruiter/job/setup/${newJobId}`);
    } catch (err) {
      console.error("Error creating job:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#1E293B] mb-1">Active Job Positions</h3>
          <p className="text-sm text-[#6B7280]">Current recruitment campaigns</p>
        </div>
        <button
          onClick={handleCreateJob}
          className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white px-4 py-2 rounded"
        >
          + Create Job Role
        </button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="group bg-gradient-to-br from-[#F9FAFB] to-white rounded-xl p-5 border border-[rgba(0,0,0,0.08)] hover:shadow-md transition-all"
            >
              {/* Header with arrow → JobSetup */}
              <div
                className="flex items-start justify-between mb-4 cursor-pointer"
                onClick={() => handleJobSetup(job.id)}
              >
                <div className="flex-1">
                  <h4 className="text-[#1E293B] mb-1">{job.title}</h4>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${job.gradient} flex items-center justify-center shadow-sm`}
                    >
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      {job.progress}% complete
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#0E7490] transition-colors" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-white border border-[rgba(0,0,0,0.05)]">
                  <div className="text-lg text-[#1E293B]">{job.resumes}</div>
                  <div className="text-xs text-[#6B7280]">Resumes</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white border border-[rgba(0,0,0,0.05)]">
                  <div className="text-lg text-[#1E293B]">{job.interviewed}</div>
                  <div className="text-xs text-[#6B7280]">Interviewed</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white border border-[rgba(0,0,0,0.05)]">
                  <div className="text-lg text-[#34D399]">{job.shortlisted}</div>
                  <div className="text-xs text-[#6B7280]">Shortlisted</div>
                </div>
              </div>

              <Progress value={job.progress} className="h-2 mb-3" />

              {/* New "See Job" button → JobPosition */}
              <button
                onClick={() => handleSeeJob(job.id)}
                className="w-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1E293B] text-sm py-2 rounded transition-colors"
              >
                See Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

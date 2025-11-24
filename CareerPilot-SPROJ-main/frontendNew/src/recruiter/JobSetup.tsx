import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { apiFetch } from "../api/fetchClient";

interface JobSetupProps {
  onBack: () => void;
  jobId?: string; // Optional for editing
}

export function JobSetup({ onBack, jobId }: JobSetupProps) {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [seniority, setSeniority] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing job details if editing
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const data = await apiFetch(`/api/jobs/${jobId}`);
        setJobTitle(data.title || "");
        setSeniority(data.seniority || "");
        setDescription(data.description || "");
        setSkills(data.skills || []);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("❌ Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  // Add / remove skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Add / remove questions
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };
  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // 🔹 Save template to backend
  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      const payload = { title: jobTitle, description, skills, questions, seniority };

      let finalJobId = jobId;
      if (jobId) {
        await apiFetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const response = await apiFetch(`/api/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        finalJobId = response.jobId;
      }

      // ✅ After save, navigate to JobPosition view
      navigate(`/recruiter/job/positions/${finalJobId}`);
    } catch (err) {
      console.error("❌ Error saving template:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-[#1E293B]">Job Role Setup</h2>
            {jobId ? (
              <p className="text-sm text-[#6B7280]">Editing Job ID: {jobId}</p>
            ) : (
              <p className="text-sm text-[#6B7280]">Create a new job position</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSaveTemplate}
          className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white"
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {jobId ? "Save Changes" : "Save Template"}
        </Button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <h3 className="text-[#1E293B] mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-[#1E293B]">Job Title *</label>
            <Input
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#1E293B]">Seniority Level *</label>
            <Select value={seniority} onValueChange={setSeniority}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intern">Intern</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid-Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#1E293B]">Job Description *</label>
          <Textarea
            placeholder="Enter a detailed job description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
        </div>
      </div>

      {/* Required Skills */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <h3 className="text-[#1E293B] mb-1">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              className="bg-gradient-to-r from-[#0E7490] to-[#38BDF8] text-white pl-3 pr-2 py-1.5 gap-2"
            >
              {skill}
              <button onClick={() => handleRemoveSkill(skill)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} className="bg-[#0E7490] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      
      </div>
      {/* Custom Interview Questions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <h3 className="text-[#1E293B] mb-1">Custom Interview Questions</h3>
        <p className="text-sm text-[#6B7280]">
          Add specific questions tailored to this role (3-7 questions recommended)
        </p>

        <div className="space-y-3 mt-2">
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-[rgba(0,0,0,0.08)]"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center text-white text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1E293B]">{question}</p>
              </div>
              <button
                onClick={() => handleRemoveQuestion(index)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-2">
          <Textarea
            placeholder="Enter your interview question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="bg-[#F9FAFB] border-[rgba(0,0,0,0.08)] focus:border-[#0E7490]"
            rows={3}
          />
          <Button
            onClick={handleAddQuestion}
            className="bg-[#34D399] hover:bg-[#34D399]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>


   🔹 Show buttons after save
   {/* {savedJobId && (
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate(`/recruiter/upload?jobId=${savedJobId}`)}
            className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white"
          >
            Upload Resumes for this Job
          </Button>

          <Button
            onClick={() => navigate("/recruiter/job")}
            variant="outline"
            className="text-[#6B7280] border-[#D1D5DB]"
          >
            Back to Job List
          </Button>
        </div> */}
      {/* )} */}
    </div>
  );
}
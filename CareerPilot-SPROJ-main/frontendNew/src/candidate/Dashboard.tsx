import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Code,
  Database,
  Shield,
  Palette,
  Cpu,
  BarChart3,
  GraduationCap,
  Upload,
  TrendingUp,
  Edit3,
} from "lucide-react";

interface DashboardProps {
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  onStartInterview?: () => void;

}
const BACKEND_URL = "https://career-pilot-s24d.onrender.com";

const domains = [
  { id: "software", name: "Software Engineering", icon: Code, color: "bg-blue-500", accent: "border-l-blue-500" },
  { id: "data", name: "Data Science / ML", icon: BarChart3, color: "bg-green-500", accent: "border-l-green-500" },
  { id: "research", name: "Research/PhD", icon: GraduationCap, color: "bg-purple-500", accent: "border-l-purple-500" },
  { id: "devops", name: "DevOps", icon: Database, color: "bg-orange-500", accent: "border-l-orange-500" },
  { id: "security", name: "Cybersecurity", icon: Shield, color: "bg-red-500", accent: "border-l-red-500" },
  { id: "design", name: "Design", icon: Palette, color: "bg-pink-500", accent: "border-l-pink-500" },
  { id: "engineering", name: "Electrical/Mechanical", icon: Cpu, color: "bg-yellow-500", accent: "border-l-yellow-500" },
];

const recentScores = [
  { domain: "Software Engineering", score: 85, date: "2 days ago", type: "Technical" },
  { domain: "Data Science", score: 78, date: "5 days ago", type: "Behavioral" },
  { domain: "DevOps", score: 92, date: "1 week ago", type: "Project-based" },
];

export default function Dashboard({ selectedDomain, setSelectedDomain }: DashboardProps) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [autoDetectDomain, setAutoDetectDomain] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [firstUploadDone, setFirstUploadDone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch existing resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/resume/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.parsed_data) setParsedData(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };
    fetchResume();
  }, [getToken]);

  useEffect(() => {
    if (autoDetectDomain && parsedData?.parsed_data) {
      setSelectedDomain(parsedData.domain || "Software Engineering");
    }
  }, [parsedData, autoDetectDomain, setSelectedDomain]);

  const handleDomainSelect = (domainName: string) => {
    setSelectedDomain(domainName);
    if (autoDetectDomain && domainName !== "Software Engineering") {
      setAutoDetectDomain(false);
    }
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/resume/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        console.error("Upload failed", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setParsedData(data);
      setShowModal(true);
      setFirstUploadDone(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/resume/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ parsed_data: parsedData.parsed_data }),
      });
      if (!res.ok) return console.error("Save failed:", await res.text());
      setShowModal(false);
      console.log("✅ Saved to backend");
    } catch (err) {
      console.error("Error updating resume:", err);
    }
  };

  // ✅ Start Interview navigation
  const handleStartInterview = () => {
    if (!selectedDomain) return;
    navigate("/interview", { state: { domain: selectedDomain, parsedData } });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Upload Resume Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Resume</CardTitle>
          <CardDescription>Upload your resume to auto-detect your domain of expertise</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-4">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <Button size="lg" className="flex items-center gap-2" onClick={() => fileInputRef.current?.click()} disabled={!!parsedData}>
            {loading ? "Uploading 🔥" : parsedData ? "Uploaded ✅" : <><Upload className="w-5 h-5" /> Upload PDF Resume</>}
          </Button>
          {parsedData?.file_url && (
            <div className="mt-4 border rounded p-2 bg-white shadow-sm">
              <embed src={parsedData.file_url} type="application/pdf" width="100%" height="250px" />
            </div>
          )}
          <div className="flex items-center space-x-2 mt-6">
            <Switch id="auto-detect" checked={autoDetectDomain} onCheckedChange={setAutoDetectDomain} />
            <Label htmlFor="auto-detect" className="text-sm">Auto-detect domain from uploaded resume</Label>
          </div>
          {autoDetectDomain && parsedData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">📄 Resume analyzed: Detected <strong>{parsedData.domain || "Software Engineering"}</strong> expertise</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Your Domain</CardTitle>
          <CardDescription>Choose your field of expertise for targeted interview practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.name;
              return (
                <Card key={domain.id} className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${domain.accent} ${isSelected ? "ring-2 ring-primary bg-accent" : ""}`} onClick={() => handleDomainSelect(domain.name)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${domain.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{domain.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Start Interview Button */}
      <Card className={`border-l-4 ${selectedDomain ? "border-l-primary" : "border-l-gray-300"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Play className="w-5 h-5" /> Start Your Interview Practice</CardTitle>
          <CardDescription>
            {selectedDomain ? `Begin a personalized ${selectedDomain} interview session` : "Select a domain above to start your interview practice"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleStartInterview} size="lg" className="w-full" disabled={!selectedDomain}>
            <Play className="w-5 h-5 mr-2" />
            {selectedDomain ? `Start ${selectedDomain} Interview` : "Select Domain First"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Scores */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Interview Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentScores.map((score, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <h4 className="font-medium">{score.domain}</h4>
                  <p className="text-sm text-gray-500">{score.type} • {score.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={score.score >= 85 ? "default" : score.score >= 70 ? "secondary" : "destructive"}>
                    {score.score}%
                  </Badge>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

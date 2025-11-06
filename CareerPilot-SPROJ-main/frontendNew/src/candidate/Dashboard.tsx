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
  onStartInterview: (parsedData: any) => void;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
}
const BACKEND_URL = "https://career-pilot-s24d.onrender.com";
const domains = [
  {
    id: "software",
    name: "Software Engineering",
    icon: Code,
    color: "bg-blue-500",
    accent: "border-l-blue-500",
  },
  {
    id: "data",
    name: "Data Science / ML",
    icon: BarChart3,
    color: "bg-green-500",
    accent: "border-l-green-500",
  },
  {
    id: "research",
    name: "Research/PhD",
    icon: GraduationCap,
    color: "bg-purple-500",
    accent: "border-l-purple-500",
  },
  {
    id: "devops",
    name: "DevOps",
    icon: Database,
    color: "bg-orange-500",
    accent: "border-l-orange-500",
  },
  {
    id: "security",
    name: "Cybersecurity",
    icon: Shield,
    color: "bg-red-500",
    accent: "border-l-red-500",
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "bg-pink-500",
    accent: "border-l-pink-500",
  },
  {
    id: "engineering",
    name: "Electrical/Mechanical",
    icon: Cpu,
    color: "bg-yellow-500",
    accent: "border-l-yellow-500",
  },
];

const recentScores = [
  {
    domain: "Software Engineering",
    score: 85,
    date: "2 days ago",
    type: "Technical",
  },
  { domain: "Data Science", score: 78, date: "5 days ago", type: "Behavioral" },
  { domain: "DevOps", score: 92, date: "1 week ago", type: "Project-based" },
];

export default function Dashboard({
  onStartInterview,
  selectedDomain,
  setSelectedDomain,
}: DashboardProps) {
  const { getToken } = useAuth();
  const [autoDetectDomain, setAutoDetectDomain] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [firstUploadDone, setFirstUploadDone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch existing resume on load
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error(
            "No Clerk token available — user might not be signed in"
          );
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/resume/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch resume:", await res.text());
          return;
        }

        const data = await res.json();
        if (data.parsed_data) setParsedData(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };

    fetchResume();
  }, [getToken]); // Add getToken as a dependency

  React.useEffect(() => {
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
      // 🔑 Get Clerk JWT
      const token = await getToken();
      console.log("Clerk token:", await getToken());
      const res = await fetch(`${BACKEND_URL}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use Clerk token
        },
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parsed_data: parsedData.parsed_data }),
      });
      if (!res.ok) {
        console.error("Save failed:", await res.text());
        return;
      }
      setShowModal(false);
      console.log("✅ Saved to backend");
    } catch (err) {
      console.error("Error updating resume:", err);
    }
  };

  const handleStartInterview = () => {
    if (!parsedData) return;
    onStartInterview(parsedData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Upload Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Resume</CardTitle>
          <CardDescription>
            Upload your resume to auto-detect your domain of expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-4">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) =>
              e.target.files?.[0] && handleUpload(e.target.files[0])
            }
          />
          <Button
            size="lg"
            className="flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={!!parsedData}
          >
            {loading ? (
              "Uploading 🔥"
            ) : parsedData ? (
              "Uploaded ✅"
            ) : (
              <>
                <Upload className="w-5 h-5" /> Upload PDF Resume
              </>
            )}
          </Button>
          {parsedData?.file_url && (
            <div className="mt-4 border rounded p-2 bg-white shadow-sm">
              <embed
                src={parsedData.file_url}
                type="application/pdf"
                width="100%"
                height="250px"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="auto-detect"
              checked={autoDetectDomain}
              onCheckedChange={setAutoDetectDomain}
              className="data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="auto-detect" className="text-sm">
              Auto-detect domain from uploaded resume
            </Label>
          </div>

          {autoDetectDomain && parsedData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                📄 Resume analyzed: Detected{" "}
                <strong>{parsedData.domain || "Software Engineering"}</strong>{" "}
                expertise
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Persistent Edit Button */}
      {parsedData && firstUploadDone && (
        <Button
          onClick={() => setShowModal(true)}
          className="bg-green-100 text-green-800 hover:bg-green-200 transition flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" /> Edit Resume
        </Button>
      )}

      {/* Modal / Resume Editor */}
      {showModal && parsedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Review & Edit Resume
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </Button>
            </div>

            {[
              "name",
              "education",
              "skills",
              "projects",
              "work_experience",
              "github",
            ].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                {Array.isArray(parsedData.parsed_data[field]) ? (
                  <textarea
                    value={parsedData.parsed_data[field].join("\n")}
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        parsed_data: {
                          ...parsedData.parsed_data,
                          [field]: e.target.value.split("\n"),
                        },
                      })
                    }
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 h-28 resize-none bg-gray-50"
                  />
                ) : (
                  <input
                    type="text"
                    value={parsedData.parsed_data[field]}
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        parsed_data: {
                          ...parsedData.parsed_data,
                          [field]: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Confirm & Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Your Domain</CardTitle>
          <CardDescription>
            Choose your field of expertise for targeted interview practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.name;
              return (
                <Card
                  key={domain.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                    domain.accent
                  } ${isSelected ? "ring-2 ring-primary bg-accent" : ""}`}
                  onClick={() => handleDomainSelect(domain.name)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${domain.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {domain.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Start Interview */}
      <Card
        className={`border-l-4 ${
          selectedDomain ? "border-l-primary" : "border-l-gray-300"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Start Your Interview Practice
          </CardTitle>
          <CardDescription>
            {selectedDomain
              ? `Begin a personalized ${selectedDomain} interview session`
              : "Select a domain above to start your interview practice"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleStartInterview}
            size="lg"
            className="w-full"
            disabled={!selectedDomain}
          >
            <Play className="w-5 h-5 mr-2" />
            {selectedDomain
              ? `Start ${selectedDomain} Interview`
              : "Select Domain First"}
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
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{score.domain}</h4>
                  <p className="text-sm text-gray-500">
                    {score.type} • {score.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      score.score >= 85
                        ? "default"
                        : score.score >= 70
                        ? "secondary"
                        : "destructive"
                    }
                  >
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

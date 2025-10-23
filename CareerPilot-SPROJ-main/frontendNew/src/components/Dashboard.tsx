import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
// import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
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
  TrendingUp
} from 'lucide-react';

interface DashboardProps {
  onStartInterview: (parsedData: any) => void;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
}

const domains = [
  { id: 'software', name: 'Software Engineering', icon: Code, color: 'bg-blue-500', accent: 'border-l-blue-500' },
  { id: 'data', name: 'Data Science / ML', icon: BarChart3, color: 'bg-green-500', accent: 'border-l-green-500' },
  { id: 'research', name: 'Research/PhD', icon: GraduationCap, color: 'bg-purple-500', accent: 'border-l-purple-500' },
  { id: 'devops', name: 'DevOps', icon: Database, color: 'bg-orange-500', accent: 'border-l-orange-500' },
  { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'bg-red-500', accent: 'border-l-red-500' },
  { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-500', accent: 'border-l-pink-500' },
  { id: 'engineering', name: 'Electrical/Mechanical', icon: Cpu, color: 'bg-yellow-500', accent: 'border-l-yellow-500' },
];

const recentScores = [
  { domain: 'Software Engineering', score: 85, date: '2 days ago', type: 'Technical' },
  { domain: 'Data Science', score: 78, date: '5 days ago', type: 'Behavioral' },
  { domain: 'DevOps', score: 92, date: '1 week ago', type: 'Project-based' },
];

const upcomingInterviews = [
  { company: 'TechCorp', date: 'Tomorrow, 2:00 PM', domain: 'Software Engineering' },
  { company: 'DataFlow Inc', date: 'Friday, 10:00 AM', domain: 'Data Science' },
];

export default function Dashboard({ onStartInterview, selectedDomain, setSelectedDomain }: DashboardProps) {
  const [autoDetectDomain, setAutoDetectDomain] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoDetectDomain && parsedData?.parsed_data) {
      setSelectedDomain(parsedData.domain || "Software Engineering");
    }
  }, [parsedData, autoDetectDomain, setSelectedDomain]);

  const handleDomainSelect = (domainName: string) => {
    setSelectedDomain(domainName);
    if (autoDetectDomain && domainName !== 'Software Engineering') {
      setAutoDetectDomain(false);
    }
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // const res = await fetch("http://127.0.0.1:5005/api/resume/upload", { method: "POST", body: formData });
      const res = await fetch("http://127.0.0.1:5005/api/resume/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,  
  },
  body: formData,
});
if (!res.ok) {
  // show friendly error (e.g., 401 => redirect to login)
  console.error("Upload failed", await res.text());
  setLoading(false);
  return;
}

      const data = await res.json();
      setParsedData(data); 
      setShowModal(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // wherever you're storing it
  
      const res = await fetch("http://127.0.0.1:5005/api/resume/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ auth now required
        },
        body: JSON.stringify({
          parsed_data: parsedData.parsed_data, // ✅ send only parsed data
        }),
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Resume</CardTitle>
          <CardDescription>Upload your resume to auto-detect your domain of expertise</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
         <Button
        size="lg"
        className="flex items-center gap-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={!!parsedData} 
      >
        {loading
          ? "Uploading 🔥"
          : parsedData
          ? "Uploaded ✅"
          : <>
              <Upload className="w-5 h-5" />
              Upload PDF Resume
            </>}
      </Button>
          </div>
    {parsedData?.file_url && (
      <div className="mt-4 border rounded p-2">
        <embed 
          src={parsedData.file_url} 
          type="application/pdf" 
          width="100%" 
          height="300px" 
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
              <p className="text-sm text-blue-700">
                📄 Resume analyzed: Detected <strong>{parsedData.domain || "Software Engineering"}</strong> expertise
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* IF U WANT TO SEE PARSED AND EDITED INPUT ON FRONTEND UNCOM,MENT THIS  */}
      {parsedData && (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Resume Preview</CardTitle>
      <CardDescription>See your edited details before starting the interview</CardDescription>
    </CardHeader>
    <CardContent>
      <p><strong>Name:</strong> {parsedData.parsed_data.name}</p>
      <p><strong>Education:</strong></p>
      <ul>
        {parsedData.parsed_data.education.map((edu: string, idx: number) => (
          <li key={idx}>{edu}</li>
        ))}
      </ul>
      <p><strong>Skills:</strong> {parsedData.parsed_data.skills.join(", ")}</p>
      <p><strong>Projects:</strong></p>
      <ul>
        {parsedData.parsed_data.projects.map((proj: string, idx: number) => (
          <li key={idx}>{proj}</li>
        ))}
      </ul>
      <p><strong>Work Experience:</strong></p>
      <ul>
        {parsedData.parsed_data.work_experience.map((we: string, idx: number) => (
          <li key={idx}>{we}</li>
        ))}
      </ul>
      <p><strong>GitHub:</strong> {parsedData.parsed_data.github.join(", ")}</p>
    </CardContent>
  </Card>
)}


      {/* Modal */}
      {showModal && parsedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Review & Edit Resume Details</h2>
              <Button variant="ghost" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-900">✕</Button>
            </div>

            {['name','education','skills','projects','work_experience','github'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 font-semibold">{field.replace('_',' ').toUpperCase()}</label>
                {Array.isArray(parsedData.parsed_data[field]) ? (
                  <textarea
                    value={parsedData.parsed_data[field].join("\n")}
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        parsed_data: { ...parsedData.parsed_data, [field]: e.target.value.split("\n") },
                      })
                    }
                    className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 h-24 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={parsedData.parsed_data[field]}
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        parsed_data: { ...parsedData.parsed_data, [field]: e.target.value },
                      })
                    }
                    className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Confirm & Save</Button>
      </div>
          </div>
        </div>
      )}

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
                <Card key={domain.id} className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${domain.accent} ${isSelected ? 'ring-2 ring-primary bg-accent' : ''}`} onClick={() => handleDomainSelect(domain.name)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${domain.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{domain.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Start Interview */}
      <Card className={`border-l-4 ${selectedDomain ? 'border-l-primary' : 'border-l-gray-300'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Start Your Interview Practice
          </CardTitle>
          <CardDescription>
            {selectedDomain 
              ? `Begin a personalized ${selectedDomain} interview session`
              : 'Select a domain above to start your interview practice'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleStartInterview} size="lg" className="w-full" disabled={!selectedDomain}>
            <Play className="w-5 h-5 mr-2" />
            {selectedDomain ? `Start ${selectedDomain} Interview` : 'Select Domain First'}
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
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{score.domain}</h4>
                  <p className="text-sm text-muted-foreground">{score.type} • {score.date}</p>
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

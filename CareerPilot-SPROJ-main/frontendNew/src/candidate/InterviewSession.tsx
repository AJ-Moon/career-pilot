import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Mic,
  MicOff,
  Gauge,
  Settings,
  Home,
  Square,
  MessageSquare,
} from "lucide-react";
import FacialAnalysis from "../FacialAnalysis";
import aiAvatar from "../assets/avatar.webp"; // Make sure this exists

interface InterviewSessionProps {
  onComplete: () => void;
  onEndInterview: () => void;
  onReturnHome: () => void;
  domain: string;
}

export default function InterviewSession({
  onComplete,
  onEndInterview,
  onReturnHome,
  domain,
}: InterviewSessionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textResponse, setTextResponse] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [bodyLanguage, setBodyLanguage] = useState("Good");
  const [eyeContact, setEyeContact] = useState("Excellent");

  // Logs collected from facial analysis updates
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  // Push a log (keep last 20)
  const pushLog = (msg: string) => {
    setLogs((prev) => {
      const next = [...prev, `${new Date().toLocaleTimeString()} — ${msg}`];
      return next.slice(-20);
    });
  };

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Callback from FacialAnalysis (emotion + attention)
  const handleAnalysisUpdate = (data: { emotion: string; attention: string }) => {
    const { emotion, attention } = data;

    // Map to metrics
    setEyeContact(attention === "Focused" ? "Excellent" : "Poor");

    if (emotion === "nervous" || emotion === "sad") {
      setBodyLanguage("Needs Improvement");
      setConfidenceLevel((p) => Math.max(30, p - 3));
    } else if (emotion === "happy" || emotion === "neutral") {
      setBodyLanguage("Good");
      setConfidenceLevel((p) => Math.min(95, p + 2));
    } else {
      setBodyLanguage("Average");
    }

    // Add readable log
    pushLog(`Emotion: ${emotion}, Attention: ${attention}`);
  };

  // Mic toggle
  const handleMicToggle = () => setIsMuted((m) => !m);

  // Sending typed answer
  const handleSendText = () => {
    if (!textResponse.trim()) return;
    pushLog(
      `Typed answer sent: "${textResponse.slice(0, 60)}${
        textResponse.length > 60 ? "..." : ""
      }"`
    );
    setTextResponse("");
    setShowTextInput(false);
    setConfidenceLevel((p) => Math.min(95, p + 2));
  };

  // Show initial log
  useEffect(() => {
    pushLog("Interview started");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white/60 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-semibold">Live Interview</h2>
          <div className="flex gap-2 mt-1 items-center">
            <Badge variant="outline">{domain || "Software Engineering"}</Badge>
            <div className="text-sm text-muted-foreground">1:1 Mock Interview</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onReturnHome}>
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Button>
          <Button variant="destructive" size="sm" onClick={onEndInterview}>
            <Square className="w-4 h-4 mr-2" /> End
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="p-6 max-w-[1300px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Center area: two equal tiles */}
          <section className="col-span-12 lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Candidate tile */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                      You
                    </div>
                    <div>
                      <div className="font-medium">Candidate</div>
                      <div className="text-xs text-muted-foreground">Live video</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Live</div>
                </div>

                <div className="p-4 flex-1 flex items-center justify-center">
                  <div className="w-full h-64">
                    <FacialAnalysis onAnalysisUpdate={handleAnalysisUpdate} />
                  </div>
                </div>
              </div>

              {/* AI interviewer tile */}
              <div className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-4">
                <img
                  src={aiAvatar}
                  alt="AI Interviewer"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <div className="mt-3 text-lg font-semibold">AI Interviewer</div>
                <div className="mt-2 text-sm text-muted-foreground text-center px-4">
                  Ask the candidate questions and evaluate answers.
                </div>

                <div className="mt-4 w-full px-4">
                  <div className="bg-indigo-50 rounded p-3 text-sm text-indigo-700 text-center">
                    "Tell me about a challenging project you led."
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  variant={isMuted ? "destructive" : "default"}
                  onClick={handleMicToggle}
                  className="flex items-center gap-2 px-6"
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isMuted ? "Muted" : "Unmuted"}
                </Button>

                <Button variant="outline" onClick={() => setShowTextInput((s) => !s)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Type Answer
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Recording: <span className="font-medium">ON</span>
              </div>
            </div>

            {/* Optional text input overlay */}
            {showTextInput && (
              <div className="bg-white rounded-xl shadow-md p-4 mt-3">
                <Textarea
                  placeholder="Type your answer..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" onClick={() => setShowTextInput(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendText}>Send</Button>
                </div>
              </div>
            )}
          </section>

          {/* Right sidebar: metrics + logs */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div className="font-medium">Confidence</div>
                  </div>
                  <div className="text-sm font-medium">{confidenceLevel}%</div>
                </div>

                <Progress value={confidenceLevel} className="h-3 mb-3" />

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="p-2 rounded bg-slate-50">
                    <div className="text-xs text-muted-foreground">Body Language</div>
                    <div className="font-medium">{bodyLanguage}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50">
                    <div className="text-xs text-muted-foreground">Eye Contact</div>
                    <div className="font-medium">{eyeContact}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live logs */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Live Logs</div>
                  <div className="text-xs text-muted-foreground">last events</div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-sm h-48 overflow-auto">
                  {logs.length === 0 ? (
                    <div className="text-muted-foreground text-sm">No logs yet</div>
                  ) : (
                    logs.slice().reverse().map((l, idx) => (
                      <div key={idx} className="py-1 border-b last:border-b-0">
                        <div className="text-xs text-muted-foreground">{l.split(" — ")[0]}</div>
                        <div>{l.split(" — ")[1]}</div>
                      </div>
                    ))
                  )}
                  <div ref={logEndRef} />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogs([]);
                      pushLog("Logs cleared");
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pushLog("Manual note: review answer")}
                  >
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="font-medium mb-2">Session Controls</div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={onComplete}>
                    Finish & Review
                  </Button>
                  <Button variant="destructive" onClick={onEndInterview}>
                    Terminate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

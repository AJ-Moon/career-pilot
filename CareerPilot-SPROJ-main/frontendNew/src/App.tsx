import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bell, ChevronDown } from "lucide-react";

// UI components
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Badge } from "./components/ui/badge";

// Candidate imports
import Dashboard from "./candidate/Dashboard";
import InterviewSession from "./candidate/InterviewSession";
import FeedbackPage from "./candidate/FeedbackPage";
import PracticeLibrary from "./candidate/PracticeLibrary";
import SettingsPage from "./candidate/SettingsPage";

// Recruiter imports
import { Dashboard_recruiter } from "./recruiter/Dashboard_Recruiter";
import LoginPage from "./components/LoginPage";

export default function App() {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("");

  const BACKEND_URL = "https://career-pilot-s24d.onrender.com";

  // ----------------------------
  // SYNC NEW USER (SIGNUP)
  // ----------------------------
  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    const newUser = params.get("newUser");
    const roleParam = params.get("role");

    if (newUser) {
      const syncUser = async () => {
        try {
          await axios.get(`${BACKEND_URL}/api/users/${user.id}`);
        } catch (err: any) {
          if (err.response?.status === 404) {
            await axios.post(`${BACKEND_URL}/api/users/create`, {
              clerk_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              role: roleParam || "candidate",
            });
          }
        }
      };

      syncUser().finally(() => {
        window.history.replaceState({}, document.title, "/");
      });
    }
  }, [user]);

  // ----------------------------
  // FETCH ROLE
  // ----------------------------
  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${user.id}`);
        setUserRole(res.data?.role || "candidate");
      } catch (err) {
        setUserRole("candidate");
      }
    };

    fetchRole();
  }, [user]);

  // ----------------------------
  // LOGIN PAGE
  // ----------------------------
  if (!user) return <SignedOut><LoginPage /></SignedOut>;

  // ----------------------------
  // LOADING ROLE
  // ----------------------------
  if (userRole === null) {
    return (
      <SignedIn>
        <div className="flex justify-center items-center h-screen text-gray-500">
          Loading...
        </div>
      </SignedIn>
    );
  }

  // ============================================================
  //      CANDIDATE NAVIGATION BAR (RESTORED FROM OLD APP.TSX)
  // ============================================================
  const CandidateNavigation = () => {
    const navigate = useNavigate();

    return (
      <nav className="bg-white border-b border-border px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-medium">CP</span>
              </div>
              <span className="text-lg font-medium">CareerPilot</span>
            </div>

            {/* Domain picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {selectedDomain || "Select Domain"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  "Software Engineering",
                  "Data Science / ML",
                  "Research/PhD",
                  "DevOps",
                  "Cybersecurity",
                  "Design",
                  "Electrical/Mechanical",
                ].map((domain) => (
                  <DropdownMenuItem
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                  >
                    {domain}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* NAV BUTTONS */}
          <div className="flex items-center gap-4">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              Dashboard
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/practice")}
            >
              Practice
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              Settings
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 bg-destructive text-xs">2</Badge>
            </Button>

            <UserButton afterSignOutUrl="/" />

          </div>
        </div>
      </nav>
    );
  };

  // ============================================================
  // ROUTER WITH RESTORED NAVIGATION
  // ============================================================
  return (
    <SignedIn>
      <BrowserRouter>
        {/* Candidate layout wrapper */}
        {userRole !== "recruiter" && <CandidateNavigation />}

        <Routes>

          {/* ================= RECRUITER =================== */}
          {userRole === "recruiter" ? (
            <>
              <Route path="/recruiter/*" element={<Dashboard_recruiter />} />
              <Route path="*" element={<Navigate to="/recruiter/dashboard" />} />
            </>
          ) : (
            <>
              {/* ================= CANDIDATE =================== */}

              <Route
                path="/"
                element={
                  <Dashboard
                    selectedDomain={selectedDomain}
                    setSelectedDomain={setSelectedDomain}
                    onStartInterview={() => {}}
                  />
                }
              />

              <Route
                path="/practice"
                element={<PracticeLibrary />}
              />

              <Route
                path="/settings"
                element={<SettingsPage />}
              />

              {/* Interview should NOT show navigation */}
              <Route
                path="/interview"
                element={
                  <InterviewSession
                    onComplete={() => {}}
                    onEndInterview={() => {}}
                    onReturnHome={() => {}}
                    domain={selectedDomain}
                  />
                }
              />

              <Route
                path="/feedback"
                element={
                  <FeedbackPage
                    domain={selectedDomain}
                    onBackToDashboard={() => {}}
                  />
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

        </Routes>
      </BrowserRouter>
    </SignedIn>
  );
}

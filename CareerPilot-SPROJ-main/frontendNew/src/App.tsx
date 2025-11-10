import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Badge } from "./components/ui/badge";
import Dashboard from "./candidate/Dashboard";
import PreInterviewModal from "./candidate/PreInterviewModal";
import InterviewSession from "./candidate/InterviewSession";
import FeedbackPage from "./candidate/FeedbackPage";
import PracticeLibrary from "./candidate/PracticeLibrary";
import SettingsPage from "./candidate/SettingsPage";
import RecruiterDashboard from "./recruiter/RecruiterDashboard";
import LoginPage from "./components/LoginPage";
import { useApi } from "./lib/api";

type PageType = "dashboard" | "pre-interview" | "interview" | "feedback" | "practice" | "settings";

export default function App() {
  const { user } = useUser();
  const api = useApi();
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [showPreInterview, setShowPreInterview] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // detect role from signup redirect params
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get("role");

  // sync with backend
  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (!user) return;

      const clerkId = user.id;
      const email = user.primaryEmailAddress?.emailAddress;

      try {
        // check if user exists in backend (authorized)
        const res = await api.get(`/users/${clerkId}`);
        setUserRole(res.data.role);
      } catch (err: any) {
        if (err.response?.status === 404) {
          // create if not found
          const payload = { clerk_id: clerkId, email, role: roleParam || "candidate" };
          const res = await api.post("/users/create", payload);
          // optional: backend could return the inserted doc or role
          setUserRole(payload.role);
        } else {
          console.error("User sync error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrCreateUser();
  }, [user]);

  // show loading screen while fetching role
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  // recruiter route
  if (userRole === "recruiter") {
    return (
      <>
        <SignedOut>
          <LoginPage />
        </SignedOut>

        <SignedIn>
          <RecruiterDashboard />
        </SignedIn>
      </>
    );
  }

  // candidate navigation
  const Navigation = () => (
    <nav className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium">CP</span>
            </div>
            <span className="text-lg font-medium">CareerPilot</span>
          </div>

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
                <DropdownMenuItem key={domain} onClick={() => setSelectedDomain(domain)}>
                  {domain}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("dashboard")}
            className={currentPage === "dashboard" ? "bg-accent" : ""}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("practice")}
            className={currentPage === "practice" ? "bg-accent" : ""}
          >
            Practice
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage("settings")}
            className={currentPage === "settings" ? "bg-accent" : ""}
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

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onStartInterview={() => setShowPreInterview(true)}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
          />
        );
      case "interview":
        return (
          <InterviewSession
            onComplete={() => setCurrentPage("feedback")}
            onEndInterview={() => setCurrentPage("feedback")}
            onReturnHome={() => setCurrentPage("dashboard")}
            domain={selectedDomain}
          />
        );
      case "feedback":
        return <FeedbackPage domain={selectedDomain} onBackToDashboard={() => setCurrentPage("dashboard")} />;
      case "practice":
        return <PracticeLibrary />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard onStartInterview={() => setShowPreInterview(true)} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />;
    }
  };

  return (
    <>
      <SignedOut>
        <LoginPage />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>{renderPage()}</main>
          {showPreInterview && (
            <PreInterviewModal
              open={showPreInterview}
              onClose={() => setShowPreInterview(false)}
              onComplete={() => setCurrentPage("interview")}
              selectedDomain={selectedDomain}
            />
          )}
        </div>
      </SignedIn>
    </>
  );
}

import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Badge } from "./components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

// 🧠 Candidate imports
import Dashboard from "./candidate/Dashboard";
import PreInterviewModal from "./candidate/PreInterviewModal";
import InterviewSession from "./candidate/InterviewSession";
import FeedbackPage from "./candidate/FeedbackPage";
import PracticeLibrary from "./candidate/PracticeLibrary";
import SettingsPage from "./candidate/SettingsPage";

// 🧠 Recruiter imports
import RecruiterDashboard from "./recruiter/RecruiterDashboard";

import LoginPage from "./components/LoginPage";

type PageType =
  | "dashboard"
  | "pre-interview"
  | "interview"
  | "feedback"
  | "practice"
  | "settings";

export default function App() {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [showPreInterview, setShowPreInterview] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Detect role from URL (after signup)
  const urlParams = new URLSearchParams(window.location.search);
  const newUser = urlParams.get("newUser");
  const roleParam = urlParams.get("role");

  useEffect(() => {
    if (roleParam) setUserRole(roleParam);
  }, [roleParam]);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (!user) return;

      const clerkId = user.id;
      const email = user.primaryEmailAddress?.emailAddress;

      console.log("🟣 Clerk user detected:", clerkId, email, "Role:", roleParam);

      try {
        const existing = await axios.get(
          `http://localhost:5005/api/users/${clerkId}`
        );
        console.log("🟢 User already exists:", existing.data);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log("🟡 Creating new user...");
          const payload = {
            clerk_id: clerkId,
            email,
            role: roleParam || "candidate",
          };
          await axios.post("http://localhost:5005/api/users/create", payload);
          console.log("✅ User created:", payload);
        }
      }
    };

    if (newUser && user) syncUserWithBackend();
  }, [user, newUser, roleParam]);

  // ✅ If recruiter, show recruiter dashboard only
  if (userRole === "recruiter") {
    return (
      <>
        <SignedOut>
          <LoginPage onLogin={(user) => console.log("Recruiter logged in:", user)} />
        </SignedOut>

        <SignedIn>
          <RecruiterDashboard />
        </SignedIn>
      </>
    );
  }

  // ✅ Candidate flow
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
            <Badge className="absolute -top-1 -right-1 bg-destructive text-xs">
              2
            </Badge>
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
        return (
          <FeedbackPage
            domain={selectedDomain}
            onBackToDashboard={() => setCurrentPage("dashboard")}
          />
        );
      case "practice":
        return <PracticeLibrary />;
      case "settings":
        return <SettingsPage user={user} />;
      ddefault:
      return (
        <Dashboard
          onStartInterview={() => setShowPreInterview(true)}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
        />
      );
    
    }
  };

  return (
    <>
      <SignedOut>
        <LoginPage onLogin={(user) => console.log("User logged in:", user)} />
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

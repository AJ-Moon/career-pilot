import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Layouts
import CandidateLayout from "./layouts/CandidateLayout";

// Candidate pages
import Dashboard from "./candidate/Dashboard";
import InterviewSession from "./candidate/InterviewSession";
import FeedbackPage from "./candidate/FeedbackPage";
import PracticeLibrary from "./candidate/PracticeLibrary";
import SettingsPage from "./candidate/SettingsPage";

// Recruiter pages
import { Dashboard_recruiter } from "./recruiter/Dashboard_Recruiter";
import LoginPage from "./components/LoginPage";

export default function App() {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("");

  const BACKEND_URL = "https://career-pilot-s24d.onrender.com";

  // Sync new user from signup redirect
  useEffect(() => {
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get("role");
    const newUser = urlParams.get("newUser");

    if (newUser) {
      const syncUser = async () => {
        try {
          await axios.get(`${BACKEND_URL}/api/users/${user.id}`);
        } catch (error: any) {
          if (error.response?.status === 404) {
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

  // Fetch existing user role
  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${user.id}`);
        setUserRole(res.data?.role || "candidate");
      } catch (err) {
        console.error(err);
        setUserRole("candidate");
      }
    };

    fetchRole();
  }, [user]);

  if (!user) return <SignedOut><LoginPage /></SignedOut>;

  if (userRole === null) {
    return (
      <SignedIn>
        <div className="flex justify-center items-center h-screen text-gray-600">
          Loading...
        </div>
      </SignedIn>
    );
  }

  return (
    <SignedIn>
      <BrowserRouter>
        <Routes>

          {/* === Recruiter Routes === */}
          {userRole === "recruiter" ? (
            <>
              <Route path="/recruiter/*" element={<Dashboard_recruiter />} />
              <Route path="*" element={<Navigate to="/recruiter/dashboard" />} />
            </>
          ) : (
            <>
              {/* === Candidate Routes (wrapped with layout) === */}

              <Route
                path="/"
                element={
                  <CandidateLayout>
                    <Dashboard
                      selectedDomain={selectedDomain}
                      setSelectedDomain={setSelectedDomain}
                      onStartInterview={() => {}}
                    />
                  </CandidateLayout>
                }
              />

              <Route
                path="/practice"
                element={
                  <CandidateLayout>
                    <PracticeLibrary />
                  </CandidateLayout>
                }
              />

              <Route
                path="/settings"
                element={
                  <CandidateLayout>
                    <SettingsPage />
                  </CandidateLayout>
                }
              />

              {/* Interview session (NO HEADER) */}
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

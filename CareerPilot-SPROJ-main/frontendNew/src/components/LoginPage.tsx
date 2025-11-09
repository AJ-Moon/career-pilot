import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Brain, MessageSquare, Target, Award } from "lucide-react";

interface LoginPageProps {
  onLogin: (user: {
    name: string;
    email: string;
    avatar?: string;
    token?: string;
  }) => void;
}
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<string | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Preparation",
      description:
        "Personalized interview questions tailored to your domain and experience level",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Feedback",
      description:
        "Get instant analysis of your responses, body language, and confidence levels",
    },
    {
      icon: Target,
      title: "Domain-Specific Training",
      description:
        "Practice with questions from Software Engineering, Data Science, DevOps, and more",
    },
    {
      icon: Award,
      title: "Track Your Progress",
      description: "Monitor improvement with detailed analytics and scoring",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Left Side - Branding & Features */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white text-xl font-medium">CP</span>
            </div>
            <span className="text-2xl font-medium text-white">CareerPilot</span>
          </div>

          <div className="mb-12">
            <h1 className="text-5xl font-medium text-white mb-6 leading-tight">
              Ace Your Next
              <span className="block text-pink-200">Interview</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Transform your interview preparation with AI-powered practice
              sessions designed to boost your confidence and land your dream
              job.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 max-w-2xl">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* ✅ Sign In Tab */}
                <TabsContent value="signin" className="space-y-4">
                  <SignIn
                    routing="hash"
                    appearance={{
                      elements: {
                        formButtonPrimary:
                          "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700",
                        footer: "hidden",
                        footerAction: "hidden",
                        cardFooter: "hidden",
                      },
                    }}
                  />
                </TabsContent>

                {/* ✅ Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  {!role ? (
                    <div className="flex flex-col items-center space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Choose your role
                      </h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setRole("candidate")}
                          className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                        >
                          Candidate
                        </button>
                        <button
                          onClick={() => setRole("recruiter")}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                          Recruiter
                        </button>
                      </div>
                    </div>
                  ) : (
                    <SignUp
                      routing="hash"
                      afterSignUpUrl={`/?newUser=true&role=${role}`}
                      appearance={{
                        elements: {
                          formButtonPrimary:
                            "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700",
                          footer: "hidden",
                          footerAction: "hidden",
                          cardFooter: "hidden",
                        },
                      }}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

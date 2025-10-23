import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Target,
  Award,
  Brain,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  // CheckCircle,
} from "lucide-react";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; avatar?: string; token?: string }) => void;
}




export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setForm({ ...form, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        throw new Error("Please fill in all required fields.");
      }

      const res = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed. Please try again.");
      localStorage.setItem("token", data.token);


      onLogin({ name: data.user.name, email: data.user.email, token: data.token });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5005/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: verifyCode }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.detail || data.msg || "Verification failed.");

      // ✅ Success → log user in
      localStorage.setItem("token", data.token);

      onLogin({
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.name || !form.email || !form.password) {
        throw new Error("All fields are required.");
      }

      const res = await fetch("http://localhost:5005/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            throw new Error(data.detail[0].msg);
          }
          if (typeof data.detail === "string") {
            throw new Error(data.detail);
          }
        }
        throw new Error(data.msg || "Signup failed. Please try again.");
      }

      setIsVerifying(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Preparation",
      description: "Personalized interview questions tailored to your domain and experience level",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Feedback",
      description: "Get instant analysis of your responses, body language, and confidence levels",
    },
    {
      icon: Target,
      title: "Domain-Specific Training",
      description: "Practice with questions from Software Engineering, Data Science, DevOps, and more",
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
        {/* Background Blurs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white text-xl font-medium">CP</span>
            </div>
            <span className="text-2xl font-medium text-white">CareerPilot</span>
          </div>

          {/* Tagline */}
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

          {/* Feature List */}
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-medium text-white mb-2">95%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium text-white mb-2">50K+</div>
              <div className="text-white/80 text-sm">Users Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium text-white mb-2">1M+</div>
              <div className="text-white/80 text-sm">Practice Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 max-w-2xl">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-pink-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                AI-Powered Interview Prep
              </span>
            </div>
            <h2 className="text-3xl font-medium text-gray-900 mb-2">
              Get Started Today
            </h2>
            <p className="text-gray-600">
              Join thousands of professionals who've mastered their interviews
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center">Welcome Back</CardTitle>
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

                {/* Sign In */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      {loading ? "Signing In..." : "Sign In to CareerPilot"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      {loading ? "Creating..." : "Create Your Account"}
                    </Button>
                  </form>
                  {isVerifying && (
                    <form onSubmit={handleVerify} className="space-y-4 mt-6">
                      <p className="text-gray-600 text-sm">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-medium">{form.email}</span>
                      </p>
                      <Input
                        type="text"
                        placeholder="Enter verification code"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="rounded-lg"
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {loading ? "Verifying..." : "Verify & Create Account"}
                      </Button>
                    </form>
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

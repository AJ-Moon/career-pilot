"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  User,
  Globe,
  Upload,
  Eye,
  Users,
  Shield,
  Accessibility,
  Camera,
  Save,
} from "lucide-react";
import type { UserResource } from "@clerk/types";

interface SettingsPageProps {
  user: UserResource;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    name:
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.username ||
      "Anonymous",
    email: user.primaryEmailAddress?.emailAddress || "No email",
    avatar: user.imageUrl || "",

    // Language & Region
    language: "english",
    timeZone: "UTC+5",
    dateFormat: "MM/DD/YYYY",

    // Interview Preferences
    facialScoring: true,
    audioRecording: true,
    videoRecording: true,
    autoSave: true,

    // Accessibility
    fontSize: 14,
    highContrast: false,
    screenReader: false,
    reducedMotion: false,

    // Privacy
    dataCollection: true,
    analytics: true,
    sharing: false,

    // Notifications
    emailNotifications: true,
    practiceReminders: true,
    weeklyReports: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const connectedSeniors = [
    {
      name: "Sarah Chen",
      role: "Senior SWE at Google",
      avatar: "",
      connected: true,
    },
    {
      name: "Michael Rodriguez",
      role: "ML Engineer at Meta",
      avatar: "",
      connected: false,
    },
    {
      name: "Priya Patel",
      role: "Product Designer at Airbnb",
      avatar: "",
      connected: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Settings & Profile</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and interview settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={settings.avatar} />
                  <AvatarFallback className="text-2xl">
                    {settings.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) =>
                      handleSettingChange("name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      handleSettingChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium mb-1">Upload Your Resume</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF, DOC, or DOCX up to 10MB
                </p>
                <Button variant="outline">Choose File</Button>
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* LANGUAGE & REGION */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interview Language</Label>
                  <RadioGroup
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="lang-english" />
                      <Label htmlFor="lang-english">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urdu" id="lang-urdu" />
                      <Label htmlFor="lang-urdu">Urdu</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <select
                    value={settings.timeZone}
                    onChange={(e) =>
                      handleSettingChange("timeZone", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+5">Pakistan Time (UTC+5)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTERVIEW TAB */}
        <TabsContent value="interview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Recording & Analysis
              </CardTitle>
              <CardDescription>
                Control what data is collected during your interviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "facial-scoring",
                  label: "Enable Facial Expression Analysis",
                  desc: "Analyze confidence and engagement through facial expressions",
                  key: "facialScoring",
                },
                {
                  id: "video-recording",
                  label: "Video Recording",
                  desc: "Record video for post-interview analysis",
                  key: "videoRecording",
                },
                {
                  id: "audio-recording",
                  label: "Audio Recording",
                  desc: "Record audio for speech analysis",
                  key: "audioRecording",
                },
                {
                  id: "auto-save",
                  label: "Auto-save Progress",
                  desc: "Automatically save interview progress",
                  key: "autoSave",
                },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={opt.id}>{opt.label}</Label>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  <Switch
                    id={opt.id}
                    checked={
                      settings[opt.key as keyof typeof settings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      handleSettingChange(opt.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCESSIBILITY TAB */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Accessibility Options
              </CardTitle>
              <CardDescription>
                Customize the interface for better accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Badge variant="outline">{settings.fontSize}px</Badge>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) =>
                    handleSettingChange("fontSize", value[0])
                  }
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>

              {[
                {
                  id: "high-contrast",
                  label: "High Contrast Mode",
                  desc: "Increase contrast for better visibility",
                  key: "highContrast",
                },
                {
                  id: "screen-reader",
                  label: "Screen Reader Support",
                  desc: "Enhanced screen reader compatibility",
                  key: "screenReader",
                },
                {
                  id: "reduced-motion",
                  label: "Reduce Motion",
                  desc: "Minimize animations and transitions",
                  key: "reducedMotion",
                },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={opt.id}>{opt.label}</Label>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  <Switch
                    id={opt.id}
                    checked={
                      settings[opt.key as keyof typeof settings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      handleSettingChange(opt.key, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MENTORSHIP TAB */}
        <TabsContent value="mentorship" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Connect with Seniors
              </CardTitle>
              <CardDescription>
                Get guidance from experienced professionals in your field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedSeniors.map((senior, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={senior.avatar} />
                      <AvatarFallback>
                        {senior.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{senior.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {senior.role}
                      </p>
                    </div>
                  </div>
                  {senior.connected ? (
                    <Badge>Connected</Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Find More Mentors
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy Controls
              </CardTitle>
              <CardDescription>
                Manage how your data is collected and used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "data-collection",
                  label: "Performance Data Collection",
                  desc: "Allow collection of interview performance data",
                  key: "dataCollection",
                },
                {
                  id: "analytics",
                  label: "Usage Analytics",
                  desc: "Help improve CareerPilot with anonymous usage data",
                  key: "analytics",
                },
                {
                  id: "sharing",
                  label: "Allow Data Sharing",
                  desc: "Share anonymized data with research partners",
                  key: "sharing",
                },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={opt.id}>{opt.label}</Label>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  <Switch
                    id={opt.id}
                    checked={
                      settings[opt.key as keyof typeof settings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      handleSettingChange(opt.key, checked)
                    }
                  />
                </div>
              ))}

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Data Retention</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Interview recordings are stored for 30 days, then
                  automatically deleted. Performance analytics are kept
                  indefinitely but anonymized after 1 year.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Download My Data
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React, { useState } from "react";
import {
  User,
  Globe,
  Upload,
  Eye,
  Users,
  Shield,
  Accessibility,
  Palette,
  Save,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    timeZone: "GMT",
    language: "english",
    fontSize: 14,
    facialScoring: false,
    anonymity: true,
    darkMode: false,
    colorTheme: "blue",
  });

  const handleSettingChange = (
    key: keyof typeof settings,
    value: unknown
  ): void => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6" /> Settings
      </h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> General Settings
              </CardTitle>
              <CardDescription>Manage your profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSettingChange("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={settings.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSettingChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select
                    value={settings.timeZone}
                    onValueChange={(value: string) =>
                      handleSettingChange("timeZone", value)
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="PKT">PKT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Language</Label>
                  <RadioGroup
                    defaultValue="english"
                    onValueChange={(value: string) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="english" />
                      <Label htmlFor="english">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urdu" id="urdu" />
                      <Label htmlFor="urdu">Urdu</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" /> Accessibility
              </CardTitle>
              <CardDescription>
                Adjust the interface to improve usability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Font Size</Label>
                <Slider
                  defaultValue={[settings.fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={(value: number[]) =>
                    handleSettingChange("fontSize", value[0])
                  }
                />
                <p className="text-sm text-gray-500 mt-2">
                  Current: {settings.fontSize}px
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Privacy Settings
              </CardTitle>
              <CardDescription>
                Manage your privacy preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Enable Facial Scoring</Label>
                <Switch
                  checked={settings.facialScoring}
                  onCheckedChange={(checked: boolean) =>
                    handleSettingChange("facialScoring", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Anonymous Mode</Label>
                <Switch
                  checked={settings.anonymity}
                  onCheckedChange={(checked: boolean) =>
                    handleSettingChange("anonymity", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" /> Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked: boolean) =>
                    handleSettingChange("darkMode", checked)
                  }
                />
              </div>

              <div>
                <Label>Color Theme</Label>
                <Select
                  value={settings.colorTheme}
                  onValueChange={(value: string) =>
                    handleSettingChange("colorTheme", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.0

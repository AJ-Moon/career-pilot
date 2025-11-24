import {
  Bell,
  Mail,
  Smartphone,
  Star,
  Clock,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { useState } from "react";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [interviewCompleted, setInterviewCompleted] = useState(true);
  const [highScoreAlert, setHighScoreAlert] = useState(true);
  const [invitationExpiry, setInvitationExpiry] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [scoreThreshold, setScoreThreshold] = useState([80]);

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-[#1E293B] mb-1">Notification Settings</h2>
        <p className="text-[#6B7280]">
          Manage your notification preferences and alert settings
        </p>
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <div>
          <h3 className="text-[#1E293B] mb-1">Notification Channels</h3>
          <p className="text-sm text-[#6B7280]">
            Choose how you want to receive notifications
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">
                  Email Notifications
                </div>
                <div className="text-xs text-[#6B7280]">
                  Receive updates via email
                </div>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A78BFA] flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">Push Notifications</div>
                <div className="text-xs text-[#6B7280]">
                  Browser notifications
                </div>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
      </div>

      {/* Event Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <div>
          <h3 className="text-[#1E293B] mb-1">Event Notifications</h3>
          <p className="text-sm text-[#6B7280]">
            Get notified about specific events
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">
                  Interview Completed
                </div>
                <div className="text-xs text-[#6B7280]">
                  When a candidate completes their interview
                </div>
              </div>
            </div>
            <Switch
              checked={interviewCompleted}
              onCheckedChange={setInterviewCompleted}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">High Score Alert</div>
                <div className="text-xs text-[#6B7280]">
                  When candidates score above threshold
                </div>
              </div>
            </div>
            <Switch
              checked={highScoreAlert}
              onCheckedChange={setHighScoreAlert}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">
                  Invitation Expiry Alerts
                </div>
                <div className="text-xs text-[#6B7280]">
                  24 hours before invitations expire
                </div>
              </div>
            </div>
            <Switch
              checked={invitationExpiry}
              onCheckedChange={setInvitationExpiry}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div>
                <div className="text-sm text-[#1E293B]">Daily Digest</div>
                <div className="text-xs text-[#6B7280]">
                  Summary of daily activity at 6 PM
                </div>
              </div>
            </div>
            <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
          </div>
        </div>
      </div>

      {/* High Score Threshold */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <div>
          <h3 className="text-[#1E293B] mb-1">High Score Threshold</h3>
          <p className="text-sm text-[#6B7280]">
            Set the minimum score to trigger high score alerts
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#1E293B]">
              Alert when score is above
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-[#0E7490]">
                {scoreThreshold[0]}%
              </span>
            </div>
          </div>

          <Slider
            value={scoreThreshold}
            onValueChange={setScoreThreshold}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#6366F1]/5 to-[#A78BFA]/5 border border-[#6366F1]/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#6B7280]">
              You'll receive instant notifications when candidates score{" "}
              {scoreThreshold[0]}% or higher on their interviews.
            </div>
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] space-y-5">
        <div>
          <h3 className="text-[#1E293B] mb-1">Email Preferences</h3>
          <p className="text-sm text-[#6B7280]">
            Customize your email notification frequency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[#1E293B]">Email Frequency</label>
            <Select defaultValue="instant">
              <SelectTrigger className="bg-[#F9FAFB] border-[rgba(0,0,0,0.08)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#1E293B]">Reminder Time</label>
            <Select defaultValue="18">
              <SelectTrigger className="bg-[#F9FAFB] border-[rgba(0,0,0,0.08)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9:00 AM</SelectItem>
                <SelectItem value="12">12:00 PM</SelectItem>
                <SelectItem value="15">3:00 PM</SelectItem>
                <SelectItem value="18">6:00 PM</SelectItem>
                <SelectItem value="21">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

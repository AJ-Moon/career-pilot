import { X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";

interface NotificationsDropdownProps {
  onClose: () => void;
}

export function NotificationsDropdown({ onClose }: NotificationsDropdownProps) {
  const notifications = [
    {
      id: "1",
      type: "success",
      icon: CheckCircle,
      title: "Interview Completed",
      message: "Sarah Johnson completed the interview with a score of 92%",
      time: "5 minutes ago",
    },
    {
      id: "2",
      type: "success",
      icon: CheckCircle,
      title: "High Score Alert",
      message: "Michael Chen scored above 80% in the technical assessment",
      time: "1 hour ago",
    },
    {
      id: "3",
      type: "warning",
      icon: AlertCircle,
      title: "Invitation Expiring",
      message: "5 interview invitations will expire in 24 hours",
      time: "2 hours ago",
    },
    {
      id: "4",
      type: "info",
      icon: Clock,
      title: "Interview in Progress",
      message: "David Kim started the interview 10 minutes ago",
      time: "10 minutes ago",
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-[#34D399]";
      case "warning":
        return "text-orange-500";
      case "info":
        return "text-[#38BDF8]";
      default:
        return "text-[#6B7280]";
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-[#1F2937]">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = notification.icon;

          return (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-opacity-10 flex items-center justify-center flex-shrink-0 ${
                    notification.type === "success"
                      ? "bg-[#34D399]"
                      : notification.type === "warning"
                      ? "bg-orange-500"
                      : "bg-[#38BDF8]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${getIconColor(notification.type)}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-[#1F2937] mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-[#6B7280] mb-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-[#6B7280]">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[#0E7490] hover:bg-[#0E7490] hover:bg-opacity-10"
        >
          Mark all as read
        </Button>
      </div>
    </div>
  );
}

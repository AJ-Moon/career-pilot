import { CheckCircle, UserCheck, Upload, Star, Clock } from 'lucide-react';
import React from 'react';

export interface TimelineItem {
  id: number;
  type: 'completed' | 'score' | 'invited' | 'upload' | 'started';
  icon: typeof CheckCircle; // or any Lucide icon type
  color: string;
  title: string;
  description: string;
  time: string;
}

interface ActivityTimelineProps {
  activity: TimelineItem[];
  loading: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activity, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
        Loading recent activity...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
      <div className="mb-6">
        <h3 className="text-[#1E293B] mb-1">Recent Activity</h3>
        <p className="text-sm text-[#6B7280]">Latest updates</p>
      </div>

      <div className="space-y-4">
        {activity.map((activityItem, index) => {
          const Icon = activityItem.icon;
          return (
            <div key={activityItem.id} className="flex gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${activityItem.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: activityItem.color }} />
                </div>
                {index < activity.length - 1 && (
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#F3F4F6]"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-[#1E293B] mb-0.5">{activityItem.title}</h4>
                    <p className="text-xs text-[#6B7280]">{activityItem.description}</p>
                  </div>
                  <span className="text-xs text-[#6B7280] whitespace-nowrap">{activityItem.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-sm text-[#0E7490] hover:text-[#38BDF8] transition-colors">
        View all activity
      </button>
    </div>
  );
};

import { LayoutDashboard, Upload, Users, Briefcase, FileText, Settings, FolderKanban } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import type { Page } from './types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user } = useUser();
  const userName = user?.fullName || "Anonymous";
  const userRole = typeof user?.publicMetadata?.role === "string"
  ? user.publicMetadata.role
  : "Recruiter";


  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as Page, label: 'Upload Resumes', icon: Upload },
    { id: 'job' as Page, label: 'Job Roles', icon: FolderKanban }, // go to grid
    { id: 'candidates' as Page, label: 'All Candidates', icon: Users },
    { id: 'reports' as Page, label: 'Reports & Export', icon: FileText },
    { id: 'settings' as Page, label: 'Notifications', icon: Settings },
  ];
  

  return (
    <aside className="w-64 bg-white border-r border-[rgba(0,0,0,0.08)] flex flex-col">
      {/* Top header with company/platform */}
      <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[#1E293B] font-bold">CareerPilot</div>
            <div className="text-xs text-[#6B7280]">AI Mock Interview</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#0E7490] text-white shadow-sm'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom user info */}
      <div className="p-4 border-t border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A78BFA] flex items-center justify-center text-white text-sm">
            {userName[0] || 'U'}
          </div>
          <div>
            <div className="text-sm text-[#1E293B]">{userName}</div>
            <div className="text-xs text-[#6B7280]">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

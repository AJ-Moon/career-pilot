import { useEffect, useState, useCallback } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import { apiFetch } from '../api/fetchClient';
import { Users, Upload, BarChart3, TrendingUp, LogOut, CheckCircle2, Mail, RefreshCcw } from 'lucide-react';
import CandidateUpload from './CandidateUpload';
import CandidateList from './CandidateList';
import CandidateScores from './CandidateScores';
import { Button } from "../components/ui/button";

type TabType = 'overview' | 'upload' | 'candidates' | 'scores';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [metrics, setMetrics] = useState({
    total_candidates: 0,
    completed_interviews: 0,
    pending_interviews: 0,
    average_score: 0,
    const { user } = useUser();
    const clerk = useClerk();
  });
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
 

  const onLogout = async () => {
    try {
      await clerk.signOut(); // ✅ Proper Clerk logout
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };


  // ✅ Updated API URLs
  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [m, a] = await Promise.all([
        apiFetch('/api/recruiter/dashboard/metrics'),
        apiFetch('/api/recruiter/dashboard/activity/recent'),
      ]);
      setMetrics(m);
      setActivity(a);
    } catch (err) {
      console.error('Failed to refresh dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard, refreshKey]);

  const handleRefresh = () => setRefreshKey((v) => v + 1);

  const stats = [
    { label: 'Total Candidates', value: String(metrics.total_candidates), change: '+12%', icon: Users, color: 'purple' },
    { label: 'Completed Interviews', value: String(metrics.completed_interviews), change: '+8%', icon: TrendingUp, color: 'green' },
    { label: 'Pending Interviews', value: String(metrics.pending_interviews), change: '-4%', icon: Users, color: 'orange' },
    { label: 'Average Score', value: `${metrics.average_score}%`, change: '+5%', icon: BarChart3, color: 'blue' },
  ];

  const recentActivity = activity.map((a: any) => ({
    type: a.interview_completed ? 'completed' : 'invited',
    candidate: a.email,
    action: a.interview_completed ? 'Completed interview' : 'Interview invite sent',
    time: new Date(a.time).toLocaleString(),
    score: a.score,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === Header === */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white">
              <span>CP</span>
            </div>
            <div>
              <h1 className="text-lg">CareerPilot</h1>
              <p className="text-sm text-gray-600">Tech Solutions Inc.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} className="bg-purple-600 text-white">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            {(['overview', 'upload', 'candidates', 'scores'] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-3 px-2 border-b-2 ${
                  activeTab === t ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'
                }`}
              >
                {t === 'overview' && <BarChart3 className="inline w-4 h-4 mr-2" />}
                {t === 'upload' && <Upload className="inline w-4 h-4 mr-2" />}
                {t === 'candidates' && <Users className="inline w-4 h-4 mr-2" />}
                {t === 'scores' && <TrendingUp className="inline w-4 h-4 mr-2" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* === Main Content === */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto">
            {loading && <p className="text-gray-500 mb-2">Refreshing...</p>}

            {/* === Stats Cards === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${s.color}-100 flex items-center justify-center`}>
                      <s.icon className={`w-6 h-6 text-${s.color}-600`} />
                    </div>
                    <span className={`text-sm ${s.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {s.change}
                    </span>
                  </div>
                  <div className="text-3xl mb-1">{s.value}</div>
                  <div className="text-gray-600 text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            {/* === Recent Activity === */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          a.type === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        {a.type === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p>{a.candidate}</p>
                        <p className="text-gray-600 text-sm">{a.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {a.score && <p className="mb-1">{a.score}%</p>}
                      <p className="text-gray-500 text-sm">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && <CandidateUpload onUploadComplete={handleRefresh} />}
        {activeTab === 'candidates' && <CandidateList refreshKey={refreshKey} />}
        {activeTab === 'scores' && <CandidateScores />}
      </main>
    </div>
  );
}

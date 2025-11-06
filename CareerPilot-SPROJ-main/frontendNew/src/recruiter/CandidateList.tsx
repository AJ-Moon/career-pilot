import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Search, Mail, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { apiFetch } from '../api/fetchClient';

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  domain: string;
  skills: string[];
  status: string;
  temp_username: string;
  uploaded_at: string;
}

interface Props {
  refreshKey?: number;
}

export default function CandidateList({ refreshKey = 0 }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const data = await apiFetch('/api/recruiter/candidates');
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [refreshKey]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Invited: 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      Completed: 'bg-green-100 text-green-700',
      'Not Attended': 'bg-red-100 text-red-700',
    };

    const icons: Record<string, any> = {
      Invited: Mail,
      'In Progress': Clock,
      Completed: CheckCircle2,
      'Not Attended': XCircle,
    };

    const Icon = icons[status] || Mail;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
          styles[status] || 'bg-gray-100 text-gray-600'
        }`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesDomain = filterDomain === 'all' || c.domain === filterDomain;

    return matchesSearch && matchesStatus && matchesDomain;
  });

  const domains = Array.from(new Set(candidates.map((c) => c.domain).filter(Boolean)));

  if (loading) {
    return <div className="text-center py-10">Loading candidates...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-1">Manage Candidates</h2>
        <p className="text-gray-600">
          View, search, and manage candidate interview invitations
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Invited">Invited</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Attended">Not Attended</option>
            </select>

            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            >
              <option value="all">All Domains</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 text-sm text-gray-600">
  <span>
    Showing {filtered.length} of {candidates.length} candidates
  </span>
  <Button
    onClick={fetchCandidates}
    className="bg-purple-600 text-white hover:bg-purple-700"
  >
    Refresh
  </Button>
</div>

      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Candidate</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Domain</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Skills</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Temp Username</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Upload Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p>{c.full_name || '(Unknown Name)'}</p>
                    <p className="text-sm text-gray-600">{c.email}</p>
                  </td>
                  <td className="px-6 py-4">{c.domain || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.skills.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                      {c.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                  <td className="px-6 py-4">
                    <code>{c.temp_username}</code>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(c.uploaded_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

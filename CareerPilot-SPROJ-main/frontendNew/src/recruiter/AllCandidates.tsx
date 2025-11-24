import { useState, useEffect } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { CandidateProfileModal } from "./CandidateProfileModal";
import { apiFetch } from "../api/fetchClient";

interface Candidate {
  id: string;
  name: string;
  jobRole: string;
  email: string;
  status: string;
  score: number | null;
}

export function AllCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [drawerCandidate, setDrawerCandidate] = useState<Candidate | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Fetch candidates from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/api/recruiter/candidates/candidates");

        const mappedCandidates = (data.candidates || []).map((c: any) => ({
          id: c.id,
          name: c.full_name,
          jobRole: c.job_role || "—", // use job_role from backend
          email: c.email,
          status: c.status,
          score: c.interview_completed ? c.technical_score || 0 : null,
        }));

        setCandidates(mappedCandidates);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "all" || candidate.jobRole === selectedRole;

    const matchesStatus =
      selectedStatus === "all" || candidate.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500 text-white";
      case "in progress":
        return "bg-blue-500 text-white";
      case "invited":
        return "bg-gray-500 text-white";
      case "expired":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes("engineer")) return "bg-blue-100 text-blue-700";
    if (r.includes("design")) return "bg-purple-100 text-purple-700";
    if (r.includes("marketing")) return "bg-green-100 text-green-700";
    if (r === "—") return "bg-gray-100 text-gray-500";
    return "bg-indigo-100 text-indigo-700"; // default
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setDrawerCandidate(candidate);
    setShowDrawer(true);
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-[#1F2937] mb-2 font-semibold">All Candidates</h2>
          <p className="text-[#6B7280]">
            Search, filter, and manage all candidates across positions
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F3F4F6] border-0"
              />
            </div>

            {/* Role Filter */}
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-[#F3F4F6] border-0">
                <SelectValue placeholder="Filter by Job Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Array.from(new Set(candidates.map((c) => c.jobRole))).map(
                  (role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-[#F3F4F6] border-0">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Invited">Invited</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-[#6B7280]">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                  <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Name</th>
                  <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Job Role</th>
                  <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Email</th>
                  <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Status</th>
                  <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Score</th>
                  <th className="text-right py-4 px-6 text-sm text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-gray-100 hover:bg-[#F9FAFB]"
                  >
                    <td className="py-4 px-6">{candidate.name}</td>
                    <td className="py-4 px-6">
                      <Badge className={`${getRoleColor(candidate.jobRole)} rounded-full px-3`}>
                        {candidate.jobRole}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-[#6B7280]">{candidate.email}</td>
                    <td className="py-4 px-6">
                      <Badge className={`${getStatusColor(candidate.status)} rounded-full px-3`}>
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">{candidate.score ?? "N/A"}</td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCandidate(candidate)}
                        className="text-[#0E7490] hover:bg-[#0E7490]/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-between text-sm text-[#6B7280]">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent side="right" className="w-full sm:w-[550px] p-0">
          {drawerCandidate && (
            <CandidateProfileModal
              candidate={drawerCandidate}
              onClose={() => setShowDrawer(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
          }
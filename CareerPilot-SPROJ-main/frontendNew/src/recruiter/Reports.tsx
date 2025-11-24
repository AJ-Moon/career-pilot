import { Download, FileText, Users, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function Reports() {
  const exportOptions = [
    {
      title: "Export All Candidates",
      description: "Download complete candidate database with all details",
      icon: Users,
      formats: ["CSV", "PDF", "Excel"],
    },
    {
      title: "Export Shortlisted Candidates",
      description: "Download only candidates marked as shortlisted",
      icon: Users,
      formats: ["CSV", "PDF"],
    },
    {
      title: "Role-Based Summary Reports",
      description: "Generate detailed reports for each job position",
      icon: FileText,
      formats: ["PDF"],
    },
    {
      title: "Weekly Insights Report",
      description: "Get weekly analytics and performance metrics",
      icon: Calendar,
      formats: ["PDF"],
    },
  ];

  const recentReports = [
    {
      name: "Software Engineer - Q4 2024",
      date: "Nov 12, 2024",
      type: "Role Summary",
      size: "2.4 MB",
    },
    {
      name: "All Candidates Export",
      date: "Nov 10, 2024",
      type: "CSV Export",
      size: "1.8 MB",
    },
    {
      name: "Weekly Insights - Week 45",
      date: "Nov 8, 2024",
      type: "Analytics",
      size: "3.1 MB",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-[#1F2937] mb-2">Export & Reporting</h2>
        <p className="text-[#6B7280]">
          Generate and download reports for your recruitment data
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option, index) => {
          const Icon = option.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#0E7490] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#0E7490]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1F2937] mb-1">{option.title}</h3>
                  <p className="text-sm text-[#6B7280]">{option.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select defaultValue={option.formats[0]}>
                  <SelectTrigger className="flex-1 bg-[#F3F4F6] border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {option.formats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-[#1F2937] mb-4">Custom Report Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Job Position
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-[#F3F4F6] border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="software">Software Engineer</SelectItem>
                <SelectItem value="ml">ML Engineer</SelectItem>
                <SelectItem value="qa">QA Analyst</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Date Range
            </label>
            <Select defaultValue="month">
              <SelectTrigger className="bg-[#F3F4F6] border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Score Range
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-[#F3F4F6] border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">80-100</SelectItem>
                <SelectItem value="medium">60-79</SelectItem>
                <SelectItem value="low">Below 60</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button className="bg-[#0E7490] hover:bg-[#0E7490]/90 text-white">
            Generate Custom Report
          </Button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-[#1F2937]">Recent Reports</h3>
          <p className="text-sm text-[#6B7280] mt-1">
            Previously generated reports
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {recentReports.map((report, index) => (
            <div
              key={index}
              className="p-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0E7490] bg-opacity-10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0E7490]" />
                </div>
                <div>
                  <h4 className="text-sm text-[#1F2937]">{report.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#6B7280]">
                      {report.type}
                    </span>
                    <span className="text-xs text-[#6B7280]">•</span>
                    <span className="text-xs text-[#6B7280]">
                      {report.date}
                    </span>
                    <span className="text-xs text-[#6B7280]">•</span>
                    <span className="text-xs text-[#6B7280]">
                      {report.size}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-[#0E7490] hover:bg-[#0E7490] hover:bg-opacity-10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

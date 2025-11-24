import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element; // <- correct typing
  trend: string;
  trendUp?: boolean;
}

export function KPICard({ title, value, icon: Icon, trend, trendUp }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)] hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0E7490] to-[#38BDF8] flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trendUp !== undefined && (
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
            trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl text-[#1E293B]">{value}</div>
        <div className="text-sm text-[#6B7280]">{title}</div>
      </div>
    </div>
  );
}

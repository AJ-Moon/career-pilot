import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

export function WeeklyActivityChart() {
  const data = [
    { day: 'Mon', interviews: 12, invites: 18 },
    { day: 'Tue', interviews: 19, invites: 24 },
    { day: 'Wed', interviews: 15, invites: 20 },
    { day: 'Thu', interviews: 22, invites: 28 },
    { day: 'Fri', interviews: 18, invites: 22 },
    { day: 'Sat', interviews: 8, invites: 10 },
    { day: 'Sun', interviews: 5, invites: 8 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
      <div className="mb-4">
        <h3 className="text-[#1E293B] mb-1">Weekly Activity</h3>
        <p className="text-sm text-[#6B7280]">Last 7 days</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0E7490" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0E7490" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#F3F4F6' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#F3F4F6' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="invites" 
              stroke="#0E7490" 
              strokeWidth={2}
              fill="url(#colorInvites)" 
            />
            <Area 
              type="monotone" 
              dataKey="interviews" 
              stroke="#34D399" 
              strokeWidth={2}
              fill="url(#colorInterviews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0E7490]"></div>
          <span className="text-xs text-[#6B7280]">Invites</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#34D399]"></div>
          <span className="text-xs text-[#6B7280]">Interviews</span>
        </div>
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export function CandidateStatusChart() {
  const data = [
    { name: 'Uploaded', value: 248 },
    { name: 'Invited', value: 187 },
    { name: 'Started', value: 156 },
    { name: 'Completed', value: 142 },
    { name: 'Shortlisted', value: 42 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
      <div className="mb-4">
        <h3 className="text-[#1E293B] mb-1">Candidate Pipeline</h3>
        <p className="text-sm text-[#6B7280]">Current funnel status</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="name" 
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
            <Bar 
              dataKey="value" 
              fill="url(#colorGradient)" 
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E7490" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

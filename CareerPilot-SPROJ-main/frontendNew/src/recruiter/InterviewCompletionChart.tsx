import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function InterviewCompletionChart() {
  const data = [
    { name: 'Completed', value: 142, color: '#34D399' },
    { name: 'In Progress', value: 28, color: '#38BDF8' },
    { name: 'Pending', value: 17, color: '#6B7280' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[rgba(0,0,0,0.08)]">
      <div className="mb-4">
        <h3 className="text-[#1E293B] mb-1">Interview Completion</h3>
        <p className="text-sm text-[#6B7280]">Current cycle status</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[#6B7280]">{item.name}</span>
            </div>
            <span className="text-[#1E293B]">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.08)]">
        <div className="text-center">
          <div className="text-2xl text-[#1E293B]">{((data[0].value / total) * 100).toFixed(0)}%</div>
          <div className="text-xs text-[#6B7280]">Completion Rate</div>
        </div>
      </div>
    </div>
  );
}

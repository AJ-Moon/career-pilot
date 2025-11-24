import { Progress } from "../components/ui/progress";

export function BatchProgress() {
  const completed = 37;
  const total = 50;
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[#1F2937] mb-1">Batch Progress</h3>
          <p className="text-sm text-[#6B7280]">Current recruitment cycle</p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-[#1F2937]">
            {completed}/{total}
          </div>
          <div className="text-sm text-[#6B7280]">Candidates Interviewed</div>
        </div>
      </div>

      <Progress value={percentage} className="h-3 mb-4" />

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-[#F3F4F6]">
          <div className="text-xl text-[#1F2937]">{percentage.toFixed(0)}%</div>
          <div className="text-xs text-[#6B7280]">Completed</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#F3F4F6]">
          <div className="text-xl text-[#1F2937]">{total - completed}</div>
          <div className="text-xs text-[#6B7280]">Pending</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#F3F4F6]">
          <div className="text-xl text-[#1F2937]">5</div>
          <div className="text-xs text-[#6B7280]">Expired</div>
        </div>
      </div>
    </div>
  );
}

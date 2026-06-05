import { Badge } from "@/components/ui/badge";

const bars = [44, 48, 43, 52, 58, 54, 62, 66, 61, 72, 70, 78, 82, 76, 88, 84, 91, 96];

export function ChartPlaceholder() {
  return (
    <div className="min-h-[420px] rounded-card border border-border bg-white p-4 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">TradingView placeholder</p>
          <h2 className="text-xl font-semibold text-primary">EUR/USD · 1.0861</h2>
        </div>
        <div className="flex gap-2">
          <Badge tone="success">+0.42%</Badge>
          <Badge>Demo feed</Badge>
        </div>
      </div>
      <div className="relative h-[320px] overflow-hidden rounded-xl border border-slate-100 bg-slate-950">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-5 opacity-25">
          {Array.from({ length: 30 }).map((_, index) => (
            <span key={index} className="border border-slate-700" />
          ))}
        </div>
        <div className="absolute inset-x-6 bottom-8 flex h-64 items-end gap-2">
          {bars.map((height, index) => (
            <span
              key={index}
              className={index % 4 === 0 ? "w-full rounded-t bg-red-400" : "w-full rounded-t bg-green-400"}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 320" preserveAspectRatio="none">
          <path
            d="M0 230 C80 210 110 238 180 198 C255 154 305 183 365 146 C430 104 500 130 570 88 C640 46 700 76 800 42"
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
}

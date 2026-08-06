"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DemandChart({ data }: { data: Array<Record<string, string | number | null>> }) {
  return (
    <div className="h-[380px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900">Historical Demand | Forecast Demand</p>
        <p className="text-xs text-slate-500">Forecast starts at the latest valid history point</p>
      </div>
      <ResponsiveContainer width="100%" height="88%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} minTickGap={16} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} width={56} tickFormatter={(v) => `${v} MW`} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
         <ReferenceLine
  x={data[Math.max(0, data.length - 1)]?.time ?? undefined}
  stroke="#94a3b8"
  strokeDasharray="4 4"
/>
          <Area type="monotone" dataKey="historical" stroke="#0f172a" fill="url(#forecastFill)" strokeWidth={2} />
          <Line type="monotone" dataKey="historical" stroke="#0f172a" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="forecast" stroke="#0f766e" strokeWidth={2.5} dot={false} strokeDasharray="6 5" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


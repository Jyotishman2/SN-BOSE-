"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DemandChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[330px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-900">Demand Trend</p>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="demand" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.62} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} width={48} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
          <Area type="monotone" dataKey="demand" stroke="#2dd4bf" fill="url(#demand)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


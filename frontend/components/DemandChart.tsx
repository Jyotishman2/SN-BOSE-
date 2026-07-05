"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DemandChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="glass h-[330px] rounded-lg p-4">
      <p className="mb-3 text-sm font-medium text-white">Demand Trend</p>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="demand" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.62} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
          <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={48} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.28)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="demand" stroke="#2dd4bf" fill="url(#demand)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


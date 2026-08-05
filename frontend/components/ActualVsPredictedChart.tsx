"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ActualVsPredictedChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="h-[350px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-900">Actual vs Predicted</p>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} width={48} />
          <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#38bdf8" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="predicted" stroke="#fb7185" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


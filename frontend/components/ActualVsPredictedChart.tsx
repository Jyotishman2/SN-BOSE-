"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ActualVsPredictedChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="glass h-[350px] rounded-lg p-4">
      <p className="mb-3 text-sm font-medium text-white">Actual vs Predicted</p>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
          <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={48} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.28)", borderRadius: 8 }} />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#38bdf8" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="predicted" stroke="#fb7185" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


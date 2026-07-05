"use client";

import ActualVsPredictedChart from "@/components/ActualVsPredictedChart";
import DemandChart from "@/components/DemandChart";
import MetricCard from "@/components/MetricCard";

const actualPredicted = Array.from({ length: 48 }, (_, i) => {
  const actual = Math.round(1760 + Math.sin(i / 4) * 150 + (i % 24 > 17 ? 160 : 0));
  return {
    time: `${i % 24}:00`,
    actual,
    predicted: actual + Math.round(Math.cos(i / 5) * 38),
  };
});

const weekly = Array.from({ length: 7 }, (_, day) => ({
  time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
  demand: Math.round(1780 + Math.sin(day) * 90),
}));

const monthly = Array.from({ length: 12 }, (_, month) => ({
  time: new Date(2026, month, 1).toLocaleString("en", { month: "short" }),
  demand: Math.round(1760 + Math.cos(month / 1.5) * 130),
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Model Quality</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Analytics</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="MAE" value="41.48 MW" sub="Mean absolute error" tone="teal" />
        <MetricCard label="RMSE" value="58.03 MW" sub="Root mean squared error" tone="sky" />
        <MetricCard label="MAPE" value="1.91%" sub="Relative error" tone="amber" />
        <MetricCard label="R2" value="0.9827" sub="Explained variance" tone="rose" />
      </div>
      <ActualVsPredictedChart data={actualPredicted} />
      <div className="grid gap-5 xl:grid-cols-2">
        <DemandChart data={weekly} />
        <DemandChart data={monthly} />
      </div>
    </div>
  );
}


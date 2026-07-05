"use client";

import DemandChart from "@/components/DemandChart";
import DemandComparisonCard from "@/components/DemandComparisonCard";
import MetricCard from "@/components/MetricCard";
import StateDemandMap from "@/components/StateDemandMap";
import WeatherImpactCard from "@/components/WeatherImpactCard";

const trend = Array.from({ length: 24 }, (_, hour) => ({
  time: `${hour.toString().padStart(2, "0")}:00`,
  demand: Math.round(1720 + Math.sin(hour / 2.8) * 120 + (hour > 17 ? 180 : 0)),
}));

export default function DashboardPage() {
  const peak = Math.max(...trend.map((row) => row.demand));
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Operations</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DemandComparisonCard today={1842} yesterday={1790} />
        <MetricCard label="Next Hour" value="1,889 MW" sub="Model estimate" tone="sky" />
        <WeatherImpactCard />
        <MetricCard label="Peak Demand" value={`${peak} MW`} sub="Today" tone="teal" />
      </div>
      <DemandChart data={trend} />
      <StateDemandMap />
    </div>
  );
}

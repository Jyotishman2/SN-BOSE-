"use client";

import { useMemo, useState } from "react";
import AnomalySummary from "@/components/AnomalySummary";
import AnomalyTable from "@/components/AnomalyTable";
import CSVUploader from "@/components/CSVUploader";
import DemandChart from "@/components/DemandChart";
import MetricCard from "@/components/MetricCard";
import { uploadAnomalyCsv } from "@/lib/api";
import type { UploadPrediction } from "@/types";

export default function AnomalyPage() {
  const [rows, setRows] = useState<UploadPrediction[]>([]);
  const anomalies = rows.filter((row) => row.is_anomaly).length;
  const chartData = useMemo(
    () =>
      rows.slice(0, 80).map((row, index) => ({
        time: new Date(row.datetime).toLocaleDateString([], { month: "short", day: "numeric" }) || `${index + 1}`,
        demand: row.actual_demand_mw ?? row.predicted_demand_mw ?? 0,
      })),
    [rows],
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Exception Review</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Anomaly Detection</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Rows Processed" value={rows.length.toString()} tone="teal" />
        <MetricCard label="Normal Share" value={rows.length ? `${Math.round(((rows.length - anomalies) / rows.length) * 100)}%` : "--"} tone="sky" />
      </div>
      <CSVUploader
        onUpload={async (file) => {
          const result = await uploadAnomalyCsv(file);
          setRows(result.rows);
          return result;
        }}
      />
      <AnomalySummary rows={rows} />
      <DemandChart data={chartData.length ? chartData : [{ time: "Awaiting CSV", demand: 0 }]} />
      <AnomalyTable rows={rows} />
    </div>
  );
}

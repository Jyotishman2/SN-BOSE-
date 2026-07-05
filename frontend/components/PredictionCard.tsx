"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ForecastResponse } from "@/types";

export default function PredictionCard({ prediction }: { prediction?: ForecastResponse }) {
  const firstPoint = prediction?.forecast[0];
  const rangeLow = firstPoint?.confidence_low;
  const rangeHigh = firstPoint?.confidence_high;
  const hasRange = typeof rangeLow === "number" && typeof rangeHigh === "number";

  return (
    <div className="glass rounded-lg p-5">
      <p className="text-sm text-slate-400">Predicted demand</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-4xl font-semibold text-white">{prediction ? prediction.predicted_demand_mw.toLocaleString() : "--"} MW</p>
        {prediction ? (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${prediction.is_anomaly ? "bg-rose-400/15 text-rose-200" : "bg-emerald-400/15 text-emerald-200"}`}>
            {prediction.is_anomaly ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
            {prediction.is_anomaly ? "Anomaly" : "Normal"}
          </span>
        ) : null}
      </div>
      <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-950/40 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Range</p>
        <p className="mt-2 text-lg font-semibold text-white">
          {hasRange ? `${Math.round(rangeLow).toLocaleString()} MW - ${Math.round(rangeHigh).toLocaleString()} MW` : "--"}
        </p>
      </div>
    </div>
  );
}

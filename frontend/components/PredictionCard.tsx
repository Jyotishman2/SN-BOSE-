"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ForecastResponse } from "@/types";

export default function PredictionCard({ prediction }: { prediction?: ForecastResponse }) {
  const firstPoint = prediction?.predictions?.[0];
  const summary = prediction?.summary;
  const rangeLow = firstPoint?.confidence_low;
  const rangeHigh = firstPoint?.confidence_high;
  const hasRange = typeof rangeLow === "number" && typeof rangeHigh === "number";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Forecast Summary</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Next Hour</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{summary ? `${summary.next_hour.toLocaleString()} MW` : "--"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">24h Peak</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{summary ? `${summary.peak.toLocaleString()} MW` : "--"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">24h Minimum</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{summary ? `${summary.minimum.toLocaleString()} MW` : "--"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Average Demand</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{summary ? `${summary.average.toLocaleString()} MW` : "--"}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Range</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          {hasRange ? `${Math.round(rangeLow).toLocaleString()} MW - ${Math.round(rangeHigh).toLocaleString()} MW` : "--"}
        </p>
      </div>

      {firstPoint ? (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Forecast Start</p>
            <p className="text-sm font-medium text-slate-900">{new Date(prediction?.forecast_start ?? firstPoint.datetime).toLocaleString()}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${firstPoint.is_anomaly ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
            {firstPoint.is_anomaly ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
            {firstPoint.is_anomaly ? "Anomaly" : "Normal"}
          </span>
        </div>
      ) : null}
    </div>
  );
}

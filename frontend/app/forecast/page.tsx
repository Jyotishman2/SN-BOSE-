"use client";

import { useMemo, useState } from "react";
import ForecastForm from "@/components/ForecastForm";
import PredictionCard from "@/components/PredictionCard";
import DemandChart from "@/components/DemandChart";

import type { ForecastResponse } from "@/types";

export default function ForecastPage() {
  const [prediction, setPrediction] = useState<ForecastResponse>();
  const chartData = useMemo(() => {
    const history = prediction?.history ?? [];
    const forecast = prediction?.predictions ?? [];
    const boundaryIndex = history.length;
    return [
      ...history.map((point) => ({
        time: new Date(point.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        historical: point.actual_demand_mw,
        forecast: null,
        boundary: boundaryIndex,
      })),
      ...forecast.map((point, idx) => ({
        time: new Date(point.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        historical: null,
        forecast: point.predicted_demand_mw,
        boundary: boundaryIndex + idx,
      })),
    ];
  }, [prediction]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Short-Term Forecast</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Forecast</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ForecastForm onResult={setPrediction} />
        <PredictionCard prediction={prediction} />
      </div>
      <DemandChart data={chartData.length ? chartData : Array.from({ length: 24 }, (_, hour) => ({ time: `${hour}:00`, historical: 0, forecast: 0 }))} />
    </div>
  );
}

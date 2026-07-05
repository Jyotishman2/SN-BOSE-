"use client";

import { useMemo, useState } from "react";
import ForecastForm from "@/components/ForecastForm";
import PredictionCard from "@/components/PredictionCard";
import DemandChart from "@/components/DemandChart";
import NextYearForecast from "@/components/NextYearForecast";
import type { ForecastResponse } from "@/types";

export default function ForecastPage() {
  const [prediction, setPrediction] = useState<ForecastResponse>();
  const chartData = useMemo(
    () =>
      prediction?.forecast.map((point) => ({
        time: new Date(point.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        demand: point.predicted_demand_mw,
      })) ?? [],
    [prediction],
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Manual Inputs</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Forecast</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ForecastForm onResult={setPrediction} />
        <PredictionCard prediction={prediction} />
      </div>
      <DemandChart data={chartData.length ? chartData : Array.from({ length: 24 }, (_, hour) => ({ time: `${hour}:00`, demand: 0 }))} />
      <NextYearForecast />
    </div>
  );
}

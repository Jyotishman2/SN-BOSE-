"use client";

import { useMemo, useState } from "react";
import { CalendarRange, Loader2 } from "lucide-react";
import DemandChart from "@/components/DemandChart";
import { getNextYearForecast } from "@/lib/api";
import type { AnnualForecastResponse } from "@/types";

export default function NextYearForecast() {
  const [forecast, setForecast] = useState<AnnualForecastResponse>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const chartData = useMemo(
    () =>
      forecast?.monthly_forecast.map((point) => ({
        time: point.month,
        demand: point.average_demand_mw,
      })) ?? [],
    [forecast],
  );

  async function loadForecast() {
    setLoading(true);
    setMessage("");
    try {
      setForecast(await getNextYearForecast());
      setMessage("Next-year forecast generated.");
    } catch (error) {
      setMessage("Next-year forecast failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const peak = forecast?.monthly_forecast.reduce((best, point) => (point.peak_demand_mw > best.peak_demand_mw ? point : best));

  return (
    <section className="space-y-4">
      <div className="glass rounded-lg p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Long Range</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Next Year Prediction</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Generates representative model predictions for each month of the next year and summarizes monthly average demand.
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={loadForecast}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-teal-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarRange size={16} />}
            Generate Year
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
      </div>

      {forecast ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
          <DemandChart data={chartData} />
          <div className="glass rounded-lg p-5">
            <p className="text-sm text-slate-400">Forecast Year</p>
            <p className="mt-2 text-3xl font-semibold text-white">{forecast.year}</p>
            <p className="mt-5 text-sm text-slate-400">Peak Month</p>
            <p className="mt-2 text-xl font-semibold text-white">{peak?.month ?? "--"}</p>
            <p className="mt-1 text-sm text-slate-300">{peak ? `${peak.peak_demand_mw.toLocaleString()} MW peak` : "--"}</p>
            <p className="mt-5 text-xs leading-5 text-slate-400">{forecast.source}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

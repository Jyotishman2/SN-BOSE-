"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CloudSun, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { createForecast, getCurrentWeather } from "@/lib/api";
import type { ForecastResponse } from "@/types";

type FormValues = {
  horizon: string;
  region: string;
  temp_ne: number;
  humidity_ne: number;
  feels_like_ne: number;
  is_holiday: boolean;
};

export default function ForecastForm({ onResult }: { onResult: (result: ForecastResponse) => void }) {
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [toast, setToast] = useState("");
  const { register, handleSubmit, getValues, setValue } = useForm<FormValues>({
    defaultValues: {
      horizon: "24",
      region: "guwahati",
      temp_ne: 22,
      humidity_ne: 72,
      feels_like_ne: 23,
      is_holiday: false,
    },
  });

  async function fillCurrentWeather() {
    setWeatherLoading(true);
    setToast("");
    try {
      const weather = await getCurrentWeather(getValues("region"));
      setValue("temp_ne", weather.temperature_c, { shouldDirty: true });
      setValue("humidity_ne", weather.humidity_percent, { shouldDirty: true });
      setValue("feels_like_ne", weather.feels_like_c, { shouldDirty: true });
      setToast(`Loaded ${weather.region} weather from ${weather.source}.`);
    } catch (error) {
      const detail = axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
      setToast(detail ? `Weather failed: ${detail}` : "Weather failed. Check that the backend can reach the weather API.");
    } finally {
      setWeatherLoading(false);
    }
  }

  async function submit(values: FormValues) {
    setLoading(true);
    setToast("");
    try {
      const result = await createForecast({
        horizon: Number(values.horizon),
        region: values.region,
        temp_ne: values.temp_ne,
        humidity_ne: values.humidity_ne,
        feels_like_ne: values.feels_like_ne,
        is_holiday: values.is_holiday ? 1 : 0,
      });
      onResult(result);
      setToast("Short-term forecast generated from the current demand history.");
    } catch (error) {
      const detail = axios.isAxiosError(error) ? error.response?.data?.detail : undefined;
      setToast(detail ? `Forecast failed: ${detail}` : "Forecast failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "focus-ring w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";

  return (
    <form onSubmit={handleSubmit(submit)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          Forecast Horizon
          <select className={inputClass} {...register("horizon")}>
            <option value="1">Next 1 Hour</option>
            <option value="6">Next 6 Hours</option>
            <option value="12">Next 12 Hours</option>
            <option value="24">Next 24 Hours</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">
          Region
          <select className={inputClass} {...register("region")}>
            <option value="guwahati">Guwahati</option>
            <option value="northeast">North-Eastern Region</option>
            <option value="shillong">Shillong</option>
            <option value="imphal">Imphal</option>
            <option value="aizawl">Aizawl</option>
            <option value="agartala">Agartala</option>
            <option value="itanagar">Itanagar</option>
            <option value="kohima">Kohima</option>
            <option value="gangtok">Gangtok</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">Temperature<input type="number" step="0.1" className={inputClass} {...register("temp_ne", { valueAsNumber: true })} /></label>
        <label className="text-sm text-slate-700">Humidity<input type="number" step="0.1" className={inputClass} {...register("humidity_ne", { valueAsNumber: true })} /></label>
        <label className="text-sm text-slate-700">Feels Like<input type="number" step="0.1" className={inputClass} {...register("feels_like_ne", { valueAsNumber: true })} /></label>
        <label className="flex items-center gap-3 pt-6 text-sm text-slate-700"><input type="checkbox" className="h-4 w-4 accent-teal-600" {...register("is_holiday")} /> Holiday</label>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Weather and lag/rolling features are derived from the latest valid historical demand history for short-term forecasting.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={weatherLoading} onClick={fillCurrentWeather} className="focus-ring inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-100 disabled:opacity-60">
          {weatherLoading ? <Loader2 className="animate-spin" size={16} /> : <CloudSun size={16} />}
          Use Live Weather
        </button>
        <button disabled={loading} className="focus-ring inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          Generate Forecast
        </button>
      </div>
      {toast ? <p className="mt-3 text-sm text-slate-600">{toast}</p> : null}
    </form>
  );
}

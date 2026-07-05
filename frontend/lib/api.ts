import axios from "axios";
import type { AnnualForecastResponse, CurrentWeather, ForecastResponse, UploadPrediction } from "@/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
});

export type ManualForecastPayload = {
  datetime: string;
  temp_ne: number;
  humidity_ne: number;
  feels_like_ne: number;
  is_holiday: number;
  recent_demands?: number[];
  lag_1h?: number;
  lag_24h?: number;
  lag_48h?: number;
  lag_168h?: number;
  lag_336h?: number;
  horizon_hours?: number;
};

export async function createForecast(payload: ManualForecastPayload) {
  const { data } = await api.post<ForecastResponse>("/api/forecast", payload);
  return data;
}

export async function getNextYearForecast() {
  const { data } = await api.get<AnnualForecastResponse>("/api/forecast/next-year");
  return data;
}

export async function getCurrentWeather(region: string) {
  const { data } = await api.get<CurrentWeather>("/api/weather/current", { params: { region } });
  return data;
}

export async function uploadForecastCsv(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ rows: UploadPrediction[]; count: number }>("/api/upload", form);
  return data;
}

export async function uploadAnomalyCsv(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ rows: UploadPrediction[]; count: number; anomalies: number }>("/api/anomaly", form);
  return data;
}

export async function healthCheck() {
  const { data } = await api.get<{ status: string; model_loaded: boolean; feature_count: number }>("/api/health");
  return data;
}

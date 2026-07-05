export type ForecastPoint = {
  datetime: string;
  predicted_demand_mw: number;
  is_anomaly: boolean;
  confidence_low?: number | null;
  confidence_high?: number | null;
};

export type ForecastResponse = {
  predicted_demand_mw: number;
  is_anomaly: boolean;
  confidence?: { method: string; std: number } | null;
  forecast: ForecastPoint[];
};

export type AnnualForecastPoint = {
  month: string;
  average_demand_mw: number;
  peak_demand_mw: number;
};

export type AnnualForecastResponse = {
  year: number;
  source: string;
  monthly_forecast: AnnualForecastPoint[];
};

export type UploadPrediction = {
  datetime: string;
  predicted_demand_mw?: number;
  actual_demand_mw?: number;
  absolute_error_mw?: number;
  anomaly_score?: number;
  is_anomaly: boolean;
  temp_ne?: number;
  humidity_ne?: number;
};

export type CurrentWeather = {
  region: string;
  latitude: number;
  longitude: number;
  temperature_c: number;
  feels_like_c: number;
  humidity_percent: number;
  observed_at: string;
  source: string;
};

export type Metric = {
  label: string;
  value: string;
  tone: "teal" | "amber" | "rose" | "sky";
};

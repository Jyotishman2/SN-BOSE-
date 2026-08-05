"use client";

import { motion } from "framer-motion";

export default function WeatherImpactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-slate-900 shadow-sm xl:col-span-2"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Weather Impact</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">{"\u{1F324}\uFE0F"} Guwahati</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">22°C</p>
        </div>
        <div className="space-y-1 text-right text-sm text-slate-600">
          <p>Humidity: <span className="font-semibold text-slate-900">74%</span></p>
          <p>Feels Like: <span className="font-semibold text-slate-900">23°C</span></p>
          <p>Rain Probability: <span className="font-semibold text-slate-900">40%</span></p>
        </div>
      </div>
    </motion.div>
  );
}

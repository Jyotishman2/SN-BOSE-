"use client";

import { motion } from "framer-motion";

export default function WeatherImpactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg bg-gradient-to-br from-amber-300/20 to-transparent p-4 text-amber-100 xl:col-span-2"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Weather Impact</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{"\u{1F324}\uFE0F"} Guwahati</p>
          <p className="mt-1 text-3xl font-semibold text-white">22°C</p>
        </div>
        <div className="space-y-1 text-right text-sm text-slate-300">
          <p>Humidity: <span className="font-semibold text-white">74%</span></p>
          <p>Feels Like: <span className="font-semibold text-white">23°C</span></p>
          <p>Rain Probability: <span className="font-semibold text-white">40%</span></p>
        </div>
      </div>
    </motion.div>
  );
}

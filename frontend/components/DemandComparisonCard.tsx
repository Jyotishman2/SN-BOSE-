"use client";

import { motion } from "framer-motion";

export default function DemandComparisonCard({
  today,
  yesterday,
}: {
  today: number;
  yesterday: number;
}) {
  const percentChange = yesterday ? ((today - yesterday) / yesterday) * 100 : 0;
  const isIncrease = percentChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg bg-gradient-to-br from-teal-300/20 to-transparent p-4 text-teal-100"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Current Demand</p>
      <div className="mt-3 space-y-2 text-sm">
        <p className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Today:</span>
          <span className="font-semibold text-white">{today.toLocaleString()} MW</span>
        </p>
        <p className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Yesterday:</span>
          <span className="font-semibold text-white">{yesterday.toLocaleString()} MW</span>
        </p>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${isIncrease ? "text-emerald-200" : "text-rose-200"}`}>
        {isIncrease ? "↑" : "↓"} {Math.abs(percentChange).toFixed(1)}%
      </p>
    </motion.div>
  );
}

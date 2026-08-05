"use client";

import { motion } from "framer-motion";

const tones = {
  teal: "border-teal-200 bg-teal-50",
  amber: "border-amber-200 bg-amber-50",
  rose: "border-rose-200 bg-rose-50",
  sky: "border-sky-200 bg-sky-50",
};

export default function MetricCard({ label, value, sub, tone = "teal" }: { label: string; value: string; sub?: string; tone?: keyof typeof tones }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${tones[tone]} p-4 shadow-sm`}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </motion.div>
  );
}

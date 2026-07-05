"use client";

import { motion } from "framer-motion";

const tones = {
  teal: "from-teal-300/20 to-transparent text-teal-100",
  amber: "from-amber-300/20 to-transparent text-amber-100",
  rose: "from-rose-300/20 to-transparent text-rose-100",
  sky: "from-sky-300/20 to-transparent text-sky-100",
};

export default function MetricCard({ label, value, sub, tone = "teal" }: { label: string; value: string; sub?: string; tone?: keyof typeof tones }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-lg bg-gradient-to-br ${tones[tone]} p-4`}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-400">{sub}</p> : null}
    </motion.div>
  );
}

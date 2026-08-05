"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UploadCloud } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/80" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex min-h-[520px] max-w-3xl flex-col justify-end px-6 pb-10 sm:px-10"
      >
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-teal-700">North-Eastern Region</p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-6xl">Electricity Demand Forecasting</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
          A production interface for next-hour load forecasts, batch CSV scoring, anomaly review, and model performance analytics.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/forecast" className="focus-ring inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white">
            Forecast <ArrowRight size={16} />
          </Link>
          <Link href="/anomaly" className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Upload CSV <UploadCloud size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}


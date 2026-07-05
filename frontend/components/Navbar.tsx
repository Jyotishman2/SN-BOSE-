"use client";

import Link from "next/link";
import { Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <motion.span
            initial={{ rotate: -8, scale: 0.92 }}
            animate={{ rotate: 0, scale: 1 }}
            className="grid h-10 w-10 place-items-center rounded-lg bg-teal-400 text-slate-950 shadow-glow"
          >
            <Zap size={22} />
          </motion.span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">NER Demand Predictor</p>
            <p className="text-xs text-slate-400">North-Eastern Region Load Forecasting</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200 sm:flex">
          <Activity size={14} />
          Live API ready
        </div>
      </div>
    </header>
  );
}


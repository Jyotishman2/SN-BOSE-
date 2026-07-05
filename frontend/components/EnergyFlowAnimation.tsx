"use client";

import { motion } from "framer-motion";
import { Factory, Home, RadioTower, Zap } from "lucide-react";

const nodes = [
  { label: "Power Generation", icon: Factory },
  { label: "Transmission", icon: RadioTower },
  { label: "Distribution", icon: Zap },
  { label: "Consumers", icon: Home },
];

const pulseDelays = [0, 0.65, 1.3, 1.95];

export default function EnergyFlowAnimation() {
  return (
    <section className="glass overflow-hidden rounded-lg p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Live Energy Flow</p>
          <h2 className="mt-2 text-2xl font-semibold text-white"> Grid Control Center</h2>
        </div>
        <p className="text-sm font-medium text-slate-300">
           Power Generation {"\u2192"} Transmission {"\u2192"} Distribution {"\u2192"} Consumers
        </p>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/50 px-4 py-6">
        <div className="absolute left-8 right-8 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-slate-800 md:block" />
        <div className="absolute left-8 right-8 top-1/2 hidden h-1 -translate-y-1/2 overflow-hidden rounded-full md:block">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-teal-200 to-transparent"
            animate={{ x: ["-120%", "320%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative grid gap-4 md:grid-cols-4">
          {nodes.map((node, index) => {
            const Icon = node.icon;

            return (
              <div key={node.label} className="relative rounded-lg border border-white/10 bg-slate-950/70 p-4 text-center">
                <motion.div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-teal-200/40 bg-teal-300/15 text-teal-100 shadow-[0_0_30px_rgba(45,212,191,0.28)]"
                  animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 18px rgba(45,212,191,0.18)", "0 0 36px rgba(45,212,191,0.45)", "0 0 18px rgba(45,212,191,0.18)"] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.25 }}
                >
                  <Icon size={22} />
                </motion.div>
                <p className="mt-3 text-sm font-semibold text-white">{node.label}</p>
                <p className="mt-1 text-xs text-slate-500">{index === 0 ? "Supply" : index === 3 ? "Load" : "Grid link"}</p>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden -translate-y-1/2 md:block">
          {pulseDelays.map((delay) => (
            <motion.span
              key={delay}
              className="absolute h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_24px_rgba(253,230,138,0.95)]"
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0], scale: [0.75, 1.18, 1, 0.75] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

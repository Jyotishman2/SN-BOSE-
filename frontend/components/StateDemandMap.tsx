"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const states = [
  {
    name: "Assam",
    demand: 725,
    trend: 8,
    path: "M154 140 L232 118 L326 132 L398 164 L370 204 L282 216 L202 198 L140 170 Z",
    labelX: 268,
    labelY: 166,
  },
  {
    name: "Meghalaya",
    demand: 210,
    trend: 3,
    path: "M176 218 L272 224 L334 214 L318 252 L232 266 L166 250 Z",
    labelX: 244,
    labelY: 240,
  },
  {
    name: "Tripura",
    demand: 180,
    trend: -2,
    path: "M302 304 L342 326 L336 396 L294 420 L266 374 Z",
    labelX: 306,
    labelY: 364,
  },
  {
    name: "Manipur",
    demand: 160,
    trend: 1,
    path: "M390 278 L444 292 L466 350 L424 392 L372 356 Z",
    labelX: 420,
    labelY: 338,
  },
];

const maxDemand = Math.max(...states.map((state) => state.demand));

const demandLevels = [
  { label: "Low Demand", marker: "\u{1F7E2}", color: "#22c55e" },
  { label: "Moderate", marker: "\u{1F7E1}", color: "#facc15" },
  { label: "High Demand", marker: "\u{1F534}", color: "#ef4444" },
];

function demandLevel(demand: number) {
  if (demand >= 500) {
    return demandLevels[2];
  }

  if (demand >= 200) {
    return demandLevels[1];
  }

  return demandLevels[0];
}

function formatTrend(trend: number) {
  return `${trend >= 0 ? "\u2191" : "\u2193"} ${Math.abs(trend)}%`;
}

export default function StateDemandMap() {
  const [activeState, setActiveState] = useState(states[0]);
  const activeLevel = demandLevel(activeState.demand);

  return (
    <section className="glass rounded-lg p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Regional Load</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{"\u{1F30E}"} Glowing North-East India Map</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          {demandLevels.map((level) => (
            <span key={level.label}>{level.marker} {level.label}</span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/40 p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(20,184,166,0.18),transparent_18rem)]" />
          <svg viewBox="0 0 560 460" role="img" aria-label="Choropleth map showing electricity demand by state" className="h-full min-h-[320px] w-full">
            <defs>
              <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#67e8f9" floodOpacity="0.45" />
                <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#020617" floodOpacity="0.32" />
              </filter>
            </defs>
            <path d="M112 92 L428 82 L494 164 L482 386 L344 438 L164 392 L82 246 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" opacity="0.72" />
            {states.map((state, index) => {
              const level = demandLevel(state.demand);
              const opacity = 0.5 + (state.demand / maxDemand) * 0.4;
              const isActive = activeState.name === state.name;

              return (
                <motion.g
                  key={state.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isActive ? [1, 1.035, 1] : [1, 1.018, 1] }}
                  transition={{ delay: index * 0.08, scale: { duration: isActive ? 1.25 : 2.1, repeat: Infinity, ease: "easeInOut" } }}
                  style={{ transformOrigin: `${state.labelX}px ${state.labelY}px` }}
                  onMouseEnter={() => setActiveState(state)}
                  onFocus={() => setActiveState(state)}
                  tabIndex={0}
                  className="cursor-pointer outline-none"
                >
                  <path d={state.path} fill={level.color} fillOpacity={opacity} stroke="#f8fafc" strokeOpacity={isActive ? "0.92" : "0.58"} strokeWidth={isActive ? "3" : "2"} filter="url(#mapGlow)" />
                  <motion.circle
                    cx={state.labelX}
                    cy={state.labelY - 24}
                    r="5"
                    fill="#f8fafc"
                    fillOpacity="0.92"
                    animate={{ r: [5, isActive ? 11 : 8, 5], opacity: [0.95, 0.35, 0.95] }}
                    transition={{ duration: isActive ? 1.1 : 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <text x={state.labelX} y={state.labelY} textAnchor="middle" className="fill-white text-[18px] font-semibold">
                    {state.name}
                  </text>
                  <text x={state.labelX} y={state.labelY + 24} textAnchor="middle" className="fill-slate-100 text-[16px] font-medium">
                    {state.demand} MW
                  </text>
                </motion.g>
              );
            })}
          </svg>

          <div className="absolute left-4 top-4 rounded-lg border border-teal-300/30 bg-slate-950/85 p-4 shadow-2xl backdrop-blur">
            <p className="text-base font-semibold text-white">{activeState.name}</p>
            <p className="mt-2 text-sm text-slate-300">Demand: <span className="font-semibold text-white">{activeState.demand} MW</span></p>
            <p className={`mt-1 text-sm font-semibold ${activeState.trend >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
              Trend: {formatTrend(activeState.trend)}
            </p>
            <p className="mt-1 text-xs text-slate-500">{activeLevel.marker} {activeLevel.label}</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">State Demand</p>
          <div className="mt-4 space-y-3">
            {states.map((state) => {
              const level = demandLevel(state.demand);

              return (
              <div key={state.name} onMouseEnter={() => setActiveState(state)} className="rounded-md p-1 transition hover:bg-white/5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: level.color }} />
                    {state.name}
                  </span>
                  <span className="font-semibold text-white">{state.demand} MW</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full" style={{ width: `${(state.demand / maxDemand) * 100}%`, backgroundColor: level.color }} />
                </div>
              </div>
            );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
            <span>Low</span>
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-400" />
            <span>High</span>
          </div>
        </div>
      </div>
    </section>
  );
}

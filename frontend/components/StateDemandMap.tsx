"use client";

import Image from "next/image";
import { useState } from "react";

// Data for each state (keeping existing data)
const states = [
  { name: "Assam", demand: 725, trend: 8 },
  { name: "Meghalaya", demand: 210, trend: 3 },
  { name: "Tripura", demand: 180, trend: -2 },
  { name: "Manipur", demand: 160, trend: 1 },
];

const maxDemand = Math.max(...states.map((s) => s.demand));

function demandLevel(demand: number) {
  if (demand >= 500) return { label: "High Demand", marker: "\u{1F534}", color: "#ef4444" };
  if (demand >= 200) return { label: "Moderate", marker: "\u{1F7E1}", color: "#facc15" };
  return { label: "Low Demand", marker: "\u{1F7E2}", color: "#22c55e" };
}

export default function StateDemandMap() {
  const [active, setActive] = useState(states[0]);
  const activeLevel = demandLevel(active.demand);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-teal-600">Regional Load</p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">🗺️ North-East India Map</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {states.map((s) => {
            const lvl = demandLevel(s.demand);
            return (
              <span key={s.name} className="flex items-center gap-1">
                <span style={{ color: lvl.color }}>{lvl.marker}</span> {s.name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
          {/* Static Assam map image */}
          <Image src="/maps/assam.png" alt="Assam map" width={300} height={300} className="object-contain" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">State Demand</p>
          <div className="mt-4 space-y-3">
            {states.map((s) => {
              const lvl = demandLevel(s.demand);
              return (
                <div
                  key={s.name}
                  onMouseEnter={() => setActive(s)}
                  className="rounded-md p-1 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: lvl.color }} />
                      {s.name}
                    </span>
                    <span className="font-semibold text-slate-900">{s.demand} MW</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${(s.demand / maxDemand) * 100}%`, backgroundColor: lvl.color }}
                    />
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

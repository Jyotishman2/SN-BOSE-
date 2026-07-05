"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gauge, Info, LineChart, Radar, UploadCloud } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/forecast", label: "Forecast", icon: LineChart },
  { href: "/analytics", label: "Model Analytics", icon: BarChart3 },
  { href: "/anomaly", label: "Anomaly", icon: Radar },
  { href: "/anomaly", label: "CSV Upload", icon: UploadCloud },
  { href: "/description", label: "Description", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav className="glass sticky top-24 rounded-lg p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                active ? "bg-teal-300 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

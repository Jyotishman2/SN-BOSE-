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
      <nav className="sticky top-24 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                active ? "bg-teal-500 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

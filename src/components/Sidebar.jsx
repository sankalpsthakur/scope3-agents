import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  ClipboardList,
  Users,
  FileText,
  AlertTriangle,
  Download,
  Link,
  BarChart3,
  Flame,
  TrendingDown,
  Building2,
  FileCheck,
  Activity,
  FileBarChart,
  FileOutput,
  History,
} from "lucide-react";
import CompanySwitcher from "@/components/CompanySwitcher";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Stage 1: Strategy",
    items: [
      { to: "/strategy/dma", icon: Target, label: "DMA Assessment" },
      { to: "/strategy/iro", icon: ClipboardList, label: "IRO Register" },
      { to: "/strategy/stakeholders", icon: Users, label: "Stakeholders" },
      { to: "/strategy/esrs", icon: FileText, label: "ESRS Reporting" },
      { to: "/strategy/risks", icon: AlertTriangle, label: "Risk Monitoring" },
    ],
  },
  {
    label: "Stage 2: Calculate",
    items: [
      { to: "/calculation/ingest", icon: Download, label: "Data Ingestion" },
      { to: "/calculation/factors", icon: Link, label: "Factor Mapping" },
      { to: "/calculation/emissions", icon: BarChart3, label: "Emissions" },
      { to: "/calculation/hotspots", icon: Flame, label: "Hotspots" },
    ],
  },
  {
    label: "Stage 3: Execute",
    items: [
      { to: "/execution/reduce", icon: TrendingDown, label: "Reduce" },
      { to: "/execution/suppliers", icon: Building2, label: "Suppliers" },
      { to: "/execution/evidence", icon: FileCheck, label: "Evidence" },
      { to: "/execution/benchmarks", icon: Activity, label: "Benchmarks" },
    ],
  },
  {
    label: "Stage 4: Report",
    items: [
      { to: "/reports", icon: FileBarChart, label: "Reports" },
      { to: "/reports/export", icon: FileOutput, label: "ESRS Export" },
      { to: "/reports/audit", icon: History, label: "Audit Trail" },
    ],
  },
];

function SidebarNavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150",
          "border-l-2 -ml-px",
          isActive
            ? "border-emerald-500 text-emerald-400 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
            : "border-transparent text-white/65 hover:text-white/90 hover:bg-white/[0.06]"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function SidebarSection({ label, items }) {
  return (
    <div className="space-y-1">
      <h3 className="px-3 pt-4 pb-1 text-[10px] font-display uppercase tracking-widest text-white/60">
        {label}
      </h3>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-[hsl(220,25%,7%)] to-[hsl(220,20%,4%)] border-r border-white/[0.12] flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.12]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30">
          <Activity className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <span className="font-display text-lg font-bold tracking-wide text-gradient-primary">
            SCOPE3
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {NAV_SECTIONS.map((section) => (
          <SidebarSection key={section.label} {...section} />
        ))}
      </div>

      <CompanySwitcher />
    </aside>
  );
}

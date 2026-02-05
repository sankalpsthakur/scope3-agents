import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ROUTE_META = {
  "/": { title: "Global Dashboard", stage: null },
  "/strategy/dma": { title: "Double Materiality Assessment", stage: "strategy" },
  "/strategy/iro": { title: "IRO Register", stage: "strategy" },
  "/strategy/stakeholders": { title: "Stakeholder Engagement", stage: "strategy" },
  "/strategy/esrs": { title: "ESRS Reporting", stage: "strategy" },
  "/strategy/risks": { title: "Risk Monitoring", stage: "strategy" },
  "/calculation/ingest": { title: "Data Ingestion", stage: "calculation" },
  "/calculation/factors": { title: "Factor Mapping", stage: "calculation" },
  "/calculation/emissions": { title: "Emissions Dashboard", stage: "calculation" },
  "/calculation/hotspots": { title: "Hotspot Analysis", stage: "calculation" },
  "/execution/reduce": { title: "Reduce Dashboard", stage: "execution" },
  "/execution/suppliers": { title: "Supplier Engagement", stage: "execution" },
  "/execution/evidence": { title: "Evidence Manager", stage: "execution" },
  "/execution/benchmarks": { title: "Peer Benchmarks", stage: "execution" },
  "/reports": { title: "Reports Dashboard", stage: "reports" },
  "/reports/export": { title: "ESRS Export", stage: "reports" },
  "/reports/audit": { title: "Audit Trail", stage: "reports" },
};

const STAGE_LABELS = {
  strategy: "Strategy",
  calculation: "Calculate",
  execution: "Execute",
  reports: "Report",
};

const STAGE_COLORS = {
  strategy: "bg-amber-500/25 text-amber-400 border-amber-500/40",
  calculation: "bg-emerald-500/25 text-emerald-400 border-emerald-500/40",
  execution: "bg-sky-500/25 text-sky-400 border-sky-500/40",
  reports: "bg-violet-500/25 text-violet-400 border-violet-500/40",
};

export default function Layout() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || { title: "Page", stage: null };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[hsl(220,25%,5%)]/90 backdrop-blur-2xl px-6 py-4 border-b border-white/[0.08]"
          style={{ boxShadow: '0 1px 0 rgba(16,185,129,0.1)' }}
        >
          <div className="flex items-center gap-3">
            {meta.stage && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-display uppercase tracking-widest ${STAGE_COLORS[meta.stage]}`}
              >
                {STAGE_LABELS[meta.stage]}
              </span>
            )}
            <h1 className="text-lg font-display font-semibold text-white tracking-tight">
              {meta.title}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

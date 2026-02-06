import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import AgentStatusBar from "@/components/AgentStatusBar";
import { useCompany } from "@/context/CompanyContext";
import { useAgentBootstrap } from "@/hooks/useAgentData";

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
  strategy: "bg-[#1BB892]/25 text-[#1BB892] border-[#1BB892]/40",
  calculation: "bg-[#2B5AEE]/25 text-[#2B5AEE] border-[#2B5AEE]/40",
  execution: "bg-[#0DC2E6]/25 text-[#0DC2E6] border-[#0DC2E6]/40",
  reports: "bg-[#9366E8]/25 text-[#9366E8] border-[#9366E8]/40",
};

export default function Layout() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] || { title: "Page", stage: null };
  const { activeCompanyId } = useCompany();
  useAgentBootstrap(activeCompanyId);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[hsl(200,30%,5%)]/90 backdrop-blur-2xl px-6 py-4 pl-16 md:pl-6 border-b border-white/[0.08]"
          style={{ boxShadow: '0 1px 0 rgba(15,214,140,0.1)' }}
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

        {/* Agent Status Bar */}
        <AgentStatusBar />

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

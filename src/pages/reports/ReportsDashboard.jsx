import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileBarChart,
  FileOutput,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCompanyESRSKPIs, useCompanyIRORegister } from "@/hooks/useCompanyData";

const STANDARD_CONFIG = {
  E1: { name: "Climate Change", category: "Environmental" },
  E2: { name: "Pollution", category: "Environmental" },
  E3: { name: "Water & Marine Resources", category: "Environmental" },
  E4: { name: "Biodiversity & Ecosystems", category: "Environmental" },
  E5: { name: "Circular Economy", category: "Environmental" },
  S1: { name: "Own Workforce", category: "Social" },
  S2: { name: "Workers in Value Chain", category: "Social" },
  S3: { name: "Affected Communities", category: "Social" },
  S4: { name: "Consumers & End-users", category: "Social" },
  G1: { name: "Business Conduct", category: "Governance" },
};


function statusBadge(pct) {
  if (pct >= 80) return { label: "Ready", style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" };
  if (pct >= 40) return { label: "In Progress", style: "bg-amber-500/15 text-amber-400 border-amber-500/25" };
  return { label: "Incomplete", style: "bg-red-500/15 text-red-400 border-red-500/25" };
}

function StandardCard({ code, config, kpis, iros, index }) {
  const completed = kpis.filter((k) => k.value > 0 && k.confidence === "High").length;
  const total = kpis.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const iroCount = iros.length;
  const status = statusBadge(pct);
  const catKey = code[0];
  const badgeColor =
    catKey === "E"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : catKey === "S"
      ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
      : "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <div
      className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={badgeColor + " text-[10px] font-mono font-bold border"}>
            {code}
          </Badge>
          <span className="text-sm font-medium text-white/80">{config.name}</span>
        </div>
        <Badge className={status.style + " text-[9px] border"}>{status.label}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-white/50">Completion</span>
          <span className="font-mono text-white/60">{pct}%</span>
        </div>
        <Progress
          value={pct}
          className="h-1.5 bg-white/[0.10]"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-white/50">
            <span className="font-mono text-white/60">{completed}</span> / {total} KPIs
          </span>
          <span className="text-[10px] text-white/50">
            <span className="font-mono text-white/60">{iroCount}</span> IROs
          </span>
        </div>
        {pct >= 80 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
        {pct >= 40 && pct < 80 && <Clock className="h-3.5 w-3.5 text-amber-400" />}
        {pct < 40 && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
      </div>
    </div>
  );
}

export default function ReportsDashboard() {
  const { data: kpis, loading: kpiLoading } = useCompanyESRSKPIs();
  const { data: iros, loading: iroLoading } = useCompanyIRORegister();

  const loading = kpiLoading || iroLoading;

  const standardStats = useMemo(() => {
    if (!kpis || !iros) return [];
    return Object.entries(STANDARD_CONFIG).map(([code, config]) => {
      const stdKpis = kpis.filter((k) => k.standard === code);
      const stdIros = iros.filter((i) => i.topicCode === code);
      return { code, config, kpis: stdKpis, iros: stdIros };
    });
  }, [kpis, iros]);

  const summary = useMemo(() => {
    if (!kpis) return { standards: 0, datapoints: 0, completionRate: 0, exportReady: 0 };
    const standards = new Set(kpis.map((k) => k.standard)).size;
    const datapoints = kpis.length;
    const completed = kpis.filter((k) => k.value > 0 && k.confidence === "High").length;
    const completionRate = datapoints > 0 ? Math.round((completed / datapoints) * 100) : 0;

    const standardCounts = {};
    kpis.forEach((k) => {
      if (!standardCounts[k.standard]) standardCounts[k.standard] = { total: 0, done: 0 };
      standardCounts[k.standard].total++;
      if (k.value > 0 && k.confidence === "High") standardCounts[k.standard].done++;
    });
    const exportReady = Object.values(standardCounts).filter(
      (s) => s.total > 0 && Math.round((s.done / s.total) * 100) >= 80
    ).length;

    return { standards, datapoints, completionRate, exportReady };
  }, [kpis]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports Dashboard"
        subtitle="ESRS reporting status and export management"
        stage="reports"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Standards Covered"
          value={summary.standards}
          unit="/ 10"
          icon={FileBarChart}
          variant="default"
        />
        <MetricCard
          label="Datapoints Collected"
          value={summary.datapoints}
          icon={CheckCircle2}
          variant="primary"
        />
        <MetricCard
          label="Completion Rate"
          value={`${summary.completionRate}%`}
          icon={Clock}
          variant="secondary"
          trend={summary.completionRate >= 60 ? "up" : "neutral"}
        />
        <MetricCard
          label="Export Ready"
          value={summary.exportReady}
          unit="standards"
          icon={FileOutput}
          variant="accent"
        />
      </div>

      <div>
        <h3 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-4">
          ESRS Standard Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {standardStats.map((s, idx) => (
            <StandardCard
              key={s.code}
              code={s.code}
              config={s.config}
              kpis={s.kpis}
              iros={s.iros}
              index={idx}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/reports/export"
          className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-300 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
              <FileOutput className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">ESRS Export</p>
              <p className="text-xs text-white/50">Prepare and export disclosures</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-violet-400 transition-colors" />
        </Link>

        <Link
          to="/reports/audit"
          className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-300 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">Audit Trail</p>
              <p className="text-xs text-white/50">Track all system and user actions</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-violet-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  BarChart3,
  TrendingDown,
  Building2,
  FileCheck,
  Target,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  Zap,
  Rocket,
} from "lucide-react";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import {
  useCompanyCompanyProfile,
  useCompanyEmissionsSummary,
  useCompanyIRORegister,
  useCompanySupplierProfiles,
  useCompanyEvidenceDocuments,
  useCompanyAuditTrail,
} from "@/hooks/useCompanyData";

const SCOPE_COLORS = ["#22c55e", "#0ea5e9", "#22d3ee"];

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function ProgressRing({ pct, color, size = 64, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function StageCard({ title, subtitle, pct, keyStat, keyLabel, color, colorClass, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <ProgressRing pct={pct} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-white/80">
              {pct}%
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-4 w-4 ${colorClass}`} />
            <h4 className="text-sm font-display font-semibold text-white tracking-tight">
              {title}
            </h4>
          </div>
          <p className="text-[10px] text-white/50 mb-2">{subtitle}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-mono font-bold ${colorClass}`}>
              {keyStat}
            </span>
            <span className="text-[10px] text-white/50">{keyLabel}</span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="glass-card p-2 min-w-[120px] shadow-2xl border border-white/10">
      <div className="flex justify-between gap-3 text-xs">
        <span className="text-white/60">{d.name}</span>
        <span className="font-mono font-bold" style={{ color: d.payload.fill }}>
          {fmt(d.value)}
        </span>
      </div>
    </div>
  );
}

function formatTimeAgo(isoStr) {
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffH / 24);
  if (diffD > 30) return d.toLocaleDateString();
  if (diffD > 0) return `${diffD}d ago`;
  if (diffH > 0) return `${diffH}h ago`;
  return "just now";
}

export default function GlobalDashboard() {
  const { data: company, loading: compLoading } = useCompanyCompanyProfile();
  const emissions = useCompanyEmissionsSummary();
  const { data: iros, loading: iroLoading } = useCompanyIRORegister();
  const { data: suppliers, loading: supLoading } = useCompanySupplierProfiles();
  const { data: evidence, loading: evLoading } = useCompanyEvidenceDocuments();
  const { data: audit, loading: auditLoading } = useCompanyAuditTrail();

  const loading = compLoading || iroLoading || supLoading || evLoading || auditLoading;

  const iroStats = useMemo(() => {
    if (!iros) return { total: 0, material: 0 };
    return {
      total: iros.length,
      material: iros.filter((i) => i.isMaterial).length,
    };
  }, [iros]);

  const supplierStats = useMemo(() => {
    if (!suppliers) return { active: 0 };
    return {
      active: suppliers.filter((s) => s.engagementStatus === "Active").length,
    };
  }, [suppliers]);

  const pieData = useMemo(() => {
    return [
      { name: "Scope 1", value: emissions.scope1, fill: SCOPE_COLORS[0] },
      { name: "Scope 2", value: emissions.scope2, fill: SCOPE_COLORS[1] },
      { name: "Scope 3", value: emissions.scope3, fill: SCOPE_COLORS[2] },
    ];
  }, [emissions]);

  const recentAudit = useMemo(() => {
    if (!audit) return [];
    return [...audit].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 5);
  }, [audit]);

  const scope3Pct = ((emissions.scope3 / emissions.total) * 100).toFixed(0);

  if (loading) return <LoadingState rows={8} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Welcome Header --- */}
      <div className="flex items-start justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-semibold tracking-tight text-white">
            Welcome back
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">{company.name}</span>
            <Badge className="bg-white/20 text-white/50 border-white/20 text-[10px] border font-mono">
              FY {company.reportingYear}
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] border">
              {company.sector}
            </Badge>
          </div>
        </div>
      </div>

      {/* --- Stage Progress Cards --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StageCard
          title="Stage 1: Strategy"
          subtitle="Double materiality & ESRS alignment"
          pct={75}
          keyStat={`${iroStats.total} IROs`}
          keyLabel={`${iroStats.material} material`}
          color="#f59e0b"
          colorClass="text-amber-400"
          icon={Target}
          to="/strategy/dma"
        />
        <StageCard
          title="Stage 2: Calculate"
          subtitle="Emissions quantification & factors"
          pct={90}
          keyStat={fmt(emissions.total)}
          keyLabel="tCO2e quantified"
          color="#22c55e"
          colorClass="text-emerald-400"
          icon={Zap}
          to="/calculation/emissions"
        />
        <StageCard
          title="Stage 3: Execute"
          subtitle="Reduction, suppliers & evidence"
          pct={40}
          keyStat={`${supplierStats.active} suppliers`}
          keyLabel="engaged"
          color="#0ea5e9"
          colorClass="text-sky-400"
          icon={Rocket}
          to="/execution/reduce"
        />
      </div>

      {/* --- Metric Cards Row --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Total Emissions"
          value={fmt(emissions.total)}
          unit="tCO2e"
          icon={BarChart3}
          variant="primary"
          trend="down"
          trendValue="-8.3%"
        />
        <MetricCard
          label="Scope 3 Share"
          value={`${scope3Pct}%`}
          unit="of total"
          icon={Layers}
          variant="accent"
        />
        <MetricCard
          label="Material Topics"
          value={iroStats.material}
          unit={`/ ${iroStats.total}`}
          icon={Target}
          variant="warning"
        />
        <MetricCard
          label="Active Suppliers"
          value={supplierStats.active}
          unit={`/ ${suppliers?.length || 0}`}
          icon={Building2}
          variant="secondary"
          trend="up"
          trendValue="+3"
        />
        <MetricCard
          label="Evidence Docs"
          value={evidence?.length || 0}
          unit="uploaded"
          icon={FileCheck}
          variant="default"
        />
        <MetricCard
          label="Reduction Target"
          value="-30%"
          unit="by 2030"
          icon={TrendingDown}
          variant="primary"
        />
      </div>

      {/* --- Two Column: Chart + Activity --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Emissions Breakdown Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-base font-display font-semibold text-white mb-4">
            Emissions Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                    stroke="none"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1">
              {pieData.map((item) => {
                const pctVal = ((item.value / emissions.total) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono text-white/80">
                          {fmt(item.value)} tCO2e
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pctVal}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/50 w-10 text-right shrink-0">
                      {pctVal}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Recent Activity Feed */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-display font-semibold text-white">
              Recent Activity
            </h3>
            <Badge className="bg-white/20 text-white/50 border-white/10 text-[10px] border">
              Last 5
            </Badge>
          </div>
          <div className="space-y-3">
            {recentAudit.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.08] transition-colors"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.10] shrink-0 mt-0.5">
                  {item.action.includes("import") ? (
                    <Activity className="h-3.5 w-3.5 text-sky-400" />
                  ) : item.action.includes("approve") || item.action.includes("Review") ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-white/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 leading-snug">
                    <span className="font-medium text-white/90">
                      {item.actor}
                    </span>{" "}
                    {item.action.toLowerCase()}
                  </p>
                  <p className="text-[10px] text-white/50 mt-0.5 truncate">
                    {item.details}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-white/45 shrink-0">
                  {formatTimeAgo(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Quick Links --- */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-display font-semibold text-white/60 mb-3">
          Quick Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: "DMA Assessment", to: "/strategy/dma", icon: Target, color: "text-amber-400" },
            { label: "IRO Register", to: "/strategy/iro", icon: Layers, color: "text-amber-400" },
            { label: "Emissions", to: "/calculation/emissions", icon: BarChart3, color: "text-emerald-400" },
            { label: "Reduce", to: "/execution/reduce", icon: TrendingDown, color: "text-sky-400" },
            { label: "Suppliers", to: "/execution/suppliers", icon: Building2, color: "text-sky-400" },
            { label: "Evidence", to: "/execution/evidence", icon: FileCheck, color: "text-sky-400" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
            >
              <link.icon className={`h-3.5 w-3.5 ${link.color}`} />
              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  Target,
  CheckCircle2,
  Gauge,
  Building2,
  ArrowDownRight,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompanyRecommendations, useCompanyEmissionsSummary } from "@/hooks/useCompanyData";

const PRIORITY_STYLES = {
  Critical:
    "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Medium:
    "bg-[#2B5AEE]/20 text-[#2B5AEE] border-[#2B5AEE]/30",
  Low: "bg-white/10 text-white/60 border-white/20",
};

const STATUS_STYLES = {
  "In Progress":
    "bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30",
  Approved:
    "bg-[#0CC5D4]/20 text-[#0CC5D4] border-[#0CC5D4]/30",
  Proposed:
    "bg-white/10 text-white/50 border-white/20",
  "Under Review":
    "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const PROJECTION_DATA = [
  { year: 2024, current: 391800, target: 391800, committed: 391800 },
  { year: 2025, current: 380000, target: 372210, committed: 365000 },
  { year: 2026, current: 370000, target: 352620, committed: 338000 },
  { year: 2027, current: 362000, target: 333030, committed: 312000 },
  { year: 2028, current: 355000, target: 313440, committed: 290000 },
  { year: 2029, current: 350000, target: 293850, committed: 278000 },
  { year: 2030, current: 346000, target: 274260, committed: 264000 },
];

const CATEGORY_REDUCTION = [
  {
    category: "Purchased Goods & Services",
    currentTCO2e: 142000,
    reductionPotential: 42600,
    initiatives: 3,
  },
  {
    category: "Raw Materials",
    currentTCO2e: 79700,
    reductionPotential: 22100,
    initiatives: 2,
  },
  {
    category: "Capital Goods",
    currentTCO2e: 58000,
    reductionPotential: 15200,
    initiatives: 2,
  },
  {
    category: "Transportation",
    currentTCO2e: 45000,
    reductionPotential: 16200,
    initiatives: 2,
  },
  {
    category: "Energy Services",
    currentTCO2e: 28000,
    reductionPotential: 6400,
    initiatives: 1,
  },
  {
    category: "Other",
    currentTCO2e: 39100,
    reductionPotential: 4400,
    initiatives: 1,
  },
];

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function fmtEur(n) {
  if (n >= 1000000) return `EUR ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `EUR ${(n / 1000).toFixed(0)}K`;
  return `EUR ${n}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 min-w-[200px] shadow-2xl border border-white/10">
      <p className="text-xs font-display font-semibold text-white/80 mb-2">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-4 text-xs mb-1">
          <span className="text-white/50 capitalize">
            {entry.dataKey === "current"
              ? "Current Trajectory"
              : entry.dataKey === "target"
              ? "Target (-30%)"
              : "Committed"}
          </span>
          <span className="font-mono font-bold" style={{ color: entry.color }}>
            {fmt(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ReduceDashboard() {
  const { data: recommendations, loading: recLoading } = useCompanyRecommendations();
  const emissions = useCompanyEmissionsSummary();
  const insights = usePageInsights("reduce");
  const handoff = usePageHandoff("reduce");

  const metrics = useMemo(() => {
    if (!recommendations) return { totalReduction: 0, committed: 0, count: 0 };
    const totalReduction = recommendations.reduce(
      (s, r) => s + r.estimatedReduction,
      0
    );
    const committed = recommendations
      .filter((r) => r.status === "In Progress" || r.status === "Approved")
      .reduce((s, r) => s + r.estimatedReduction, 0);
    return { totalReduction, committed, count: recommendations.length };
  }, [recommendations]);

  const sortedRecs = useMemo(() => {
    if (!recommendations) return [];
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...recommendations].sort(
      (a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4)
    );
  }, [recommendations]);

  if (recLoading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reduction Dashboard"
        subtitle="Track decarbonization targets & reduction initiatives"
        stage="execution"
        actions={
          <>
            <AgentHandoffButton handoff={handoff} />
            <Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2">
              <Plus className="h-3.5 w-3.5" />
              Add Initiative
            </Button>
          </>
        }
      />

      {/* --- Metric Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Emissions"
          value={fmt(emissions.total)}
          unit="tCO2e"
          icon={TrendingDown}
          variant="primary"
          trend="down"
          trendValue="-8.3% YoY"
        />
        <MetricCard
          label="Reduction Target"
          value="-30%"
          unit="by 2030"
          icon={Target}
          variant="secondary"
        />
        <MetricCard
          label="Committed Reductions"
          value={fmt(metrics.committed)}
          unit="tCO2e"
          icon={CheckCircle2}
          variant="accent"
          trend="up"
          trendValue={`${((metrics.committed / emissions.total) * 100).toFixed(
            1
          )}% of total`}
        />
        <MetricCard
          label="On Track"
          value="Yes"
          icon={Gauge}
          variant="primary"
          trend="up"
          trendValue="4 initiatives active"
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      {/* --- Main two-column --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT: Reduction Roadmap Chart */}
        <div className="glass-card card-execute p-6">
          <div className="mb-4">
            <h3 className="text-base font-display font-semibold text-white">
              Emissions Reduction Roadmap
            </h3>
            <p className="text-xs text-white/65 mt-0.5">
              Projected trajectory vs. target (-30% by 2030)
            </p>
          </div>
          <div className="flex items-center gap-5 mb-4 text-[11px] text-white/50">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 rounded-full" />
              Current Trajectory
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#0FD68C] rounded-full border-dashed" />
              Target (-30%)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#0CC5D4] rounded-full" />
              Committed Reductions
            </div>
          </div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={PROJECTION_DATA}
                margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
              >
                <defs>
                  <linearGradient
                    id="currentGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f59e0b"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f59e0b"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient
                    id="committedGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#0CC5D4"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#0CC5D4"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="year"
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                  }
                  width={48}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#currentGrad)"
                  animationDuration={800}
                />
                <Area
                  type="monotone"
                  dataKey="committed"
                  stroke="#0CC5D4"
                  strokeWidth={2}
                  fill="url(#committedGrad)"
                  animationDuration={1000}
                />
                <ReferenceLine
                  y={274260}
                  stroke="#0FD68C"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={{
                    value: "Target: 274,260 tCO2e",
                    position: "insideTopRight",
                    fill: "#0FD68C",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Recommendations list */}
        <div className="glass-card card-execute p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-display font-semibold text-white">
                Reduction Initiatives
              </h3>
              <p className="text-xs text-white/65 mt-0.5">
                Sorted by priority
              </p>
            </div>
            <Badge className="bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30 text-[10px] border">
              {sortedRecs.length} initiatives
            </Badge>
          </div>
          <ScrollArea className="flex-1 -mx-1 pr-1" style={{ maxHeight: 380 }}>
            <div className="space-y-3 px-1">
              {sortedRecs.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="glass-subtle rounded-lg p-4 hover:bg-white/[0.10] transition-all duration-200"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white/90 leading-snug">
                      {rec.title}
                    </p>
                    <Badge
                      className={`${
                        PRIORITY_STYLES[rec.priority]
                      } text-[10px] border shrink-0`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 mb-3 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-[11px]">
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3 text-[#0FD68C]" />
                      <span className="font-mono font-bold text-[#0FD68C]">
                        {fmt(rec.estimatedReduction)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-white/40" />
                      <span className="font-mono text-white/60">
                        {fmtEur(rec.estimatedCost)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/40" />
                      <span className="font-mono text-white/60">
                        {rec.paybackYears}yr
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-white/40" />
                      <span className="font-mono text-white/60">
                        {rec.linkedSuppliers.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.08]">
                    <span className="text-[10px] text-white/40">
                      {rec.category}
                    </span>
                    <Badge
                      className={`${
                        STATUS_STYLES[rec.status] ||
                        "bg-white/10 text-white/50 border-white/20"
                      } text-[10px] border`}
                    >
                      {rec.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* --- Bottom: Reduction by Category Table --- */}
      <div className="glass-card card-execute p-6">
        <div className="mb-4">
          <h3 className="text-base font-display font-semibold text-white">
            Reduction Potential by Category
          </h3>
          <p className="text-xs text-white/65 mt-0.5">
            Which categories have the most reduction potential
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white/50 font-display text-xs">
                Category
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Current tCO2e
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Reduction Potential
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                % Reduction
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Initiatives
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs">
                Progress
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORY_REDUCTION.map((cat) => {
              const pct = ((cat.reductionPotential / cat.currentTCO2e) * 100).toFixed(
                1
              );
              return (
                <TableRow key={cat.category} className="border-white/[0.08]">
                  <TableCell className="text-sm text-white/80">
                    {cat.category}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/70">
                    {fmt(cat.currentTCO2e)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-[#0FD68C] font-semibold">
                    -{fmt(cat.reductionPotential)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/60">
                    {pct}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/60">
                    {cat.initiatives}
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0FD68C] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(Number(pct), 100)}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

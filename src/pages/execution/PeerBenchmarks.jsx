import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import { Activity, Award, TrendingDown, BarChart3, Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompanyPeerBenchmarks, useCompanyEmissionsSummary } from "@/hooks/useCompanyData";
import { useCompany } from "@/context/CompanyContext";

const CDP_COLORS = {
  A: "bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30",
  "A-": "bg-[#0FD68C]/15 text-[#0FD68C]/80 border-[#0FD68C]/25",
  B: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  C: "bg-red-500/20 text-red-400 border-red-500/30",
  D: "bg-red-500/30 text-red-400 border-red-500/40",
};

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function TotalEmissionsTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 min-w-[180px] shadow-2xl border border-white/10">
      <p className="text-xs font-display font-semibold text-white/80 mb-1">
        {d.company}
      </p>
      <div className="text-xs text-white/50 mb-1">{d.sector}</div>
      <div className="flex justify-between gap-4 text-xs">
        <span className="text-white/50">Total tCO2e</span>
        <span className="font-mono font-bold text-[#0FD68C]">
          {fmt(d.tCO2eTotal)}
        </span>
      </div>
      <div className="flex justify-between gap-4 text-xs mt-1">
        <span className="text-white/50">Revenue</span>
        <span className="font-mono text-white/70">EUR {d.revenue}M</span>
      </div>
    </div>
  );
}

function IntensityTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 min-w-[180px] shadow-2xl border border-white/10">
      <p className="text-xs font-display font-semibold text-white/80 mb-1">
        {d.company}
      </p>
      <div className="flex justify-between gap-4 text-xs">
        <span className="text-white/50">Intensity</span>
        <span className="font-mono font-bold text-[#0CC5D4]">
          {d.intensityPerRevenue.toFixed(1)}
        </span>
      </div>
      <div className="flex justify-between gap-4 text-xs mt-1">
        <span className="text-white/50">tCO2e / EUR M</span>
      </div>
    </div>
  );
}

export default function PeerBenchmarks() {
  const { data: peers, loading } = useCompanyPeerBenchmarks();
  const emissions = useCompanyEmissionsSummary();
  const { company } = useCompany();
  const myName = company.name;
  const insights = usePageInsights("benchmarks");
  const handoff = usePageHandoff("benchmarks");

  const chartData = useMemo(() => {
    if (!peers) return [];
    return [...peers].sort((a, b) => b.tCO2eTotal - a.tCO2eTotal);
  }, [peers]);

  const intensityData = useMemo(() => {
    if (!peers) return [];
    return [...peers].sort((a, b) => b.intensityPerRevenue - a.intensityPerRevenue);
  }, [peers]);

  const myRank = useMemo(() => {
    if (!peers) return { rank: 0, total: 0 };
    const sorted = [...peers].sort(
      (a, b) => a.intensityPerRevenue - b.intensityPerRevenue
    );
    const idx = sorted.findIndex((p) => p.company === myName);
    return { rank: idx + 1, total: sorted.length };
  }, [peers, myName]);

  const avgIntensity = useMemo(() => {
    if (!peers) return 0;
    return (
      peers.reduce((s, p) => s + p.intensityPerRevenue, 0) / peers.length
    ).toFixed(1);
  }, [peers]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Peer Benchmarks"
        subtitle="Compare your performance against industry peers"
        stage="execution"
        actions={
          <>
            <AgentHandoffButton handoff={handoff} />
            <Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2">
              <Plus className="h-3.5 w-3.5" />
              Add Peer
            </Button>
          </>
        }
      />

      {/* --- Metric Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Your Emissions"
          value={fmt(emissions.total)}
          unit="tCO2e"
          icon={BarChart3}
          variant="primary"
        />
        <MetricCard
          label="Intensity Rank"
          value={`#${myRank.rank}`}
          unit={`of ${myRank.total}`}
          icon={Award}
          variant="secondary"
          trend={myRank.rank <= 3 ? "up" : "down"}
          trendValue={myRank.rank <= 3 ? "Top quartile" : "Room to improve"}
        />
        <MetricCard
          label="Avg Peer Intensity"
          value={avgIntensity}
          unit="tCO2e/EUR M"
          icon={Activity}
          variant="default"
        />
        <MetricCard
          label="Scope 3 Share"
          value="78%"
          unit="of total"
          icon={TrendingDown}
          variant="accent"
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Total Emissions Comparison */}
        <div className="glass-card card-execute p-6">
          <div className="mb-4">
            <h3 className="text-base font-display font-semibold text-white">
              Total Emissions Comparison
            </h3>
            <p className="text-xs text-white/65 mt-0.5">
              tCO2e by company. Your company highlighted in emerald.
            </p>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="company"
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontFamily: "Barlow Condensed",
                  }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                  height={50}
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
                <RechartsTooltip content={<TotalEmissionsTooltip />} />
                <Bar
                  dataKey="tCO2eTotal"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={
                        entry.company === myName
                          ? "#0FD68C"
                          : "rgba(255,255,255,0.15)"
                      }
                      stroke={
                        entry.company === myName
                          ? "#0FD68C"
                          : "rgba(255,255,255,0.05)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intensity Comparison */}
        <div className="glass-card card-execute p-6">
          <div className="mb-4">
            <h3 className="text-base font-display font-semibold text-white">
              Emissions Intensity
            </h3>
            <p className="text-xs text-white/65 mt-0.5">
              tCO2e per EUR M revenue. Lower is better.
            </p>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={intensityData}
                margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="company"
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontFamily: "Barlow Condensed",
                  }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                  width={48}
                />
                <RechartsTooltip content={<IntensityTooltip />} />
                <Bar
                  dataKey="intensityPerRevenue"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                >
                  {intensityData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={
                        entry.company === myName
                          ? "#0FD68C"
                          : "rgba(255,255,255,0.15)"
                      }
                    />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="intensityPerRevenue"
                  stroke="#0CC5D4"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                  animationDuration={1000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Comparison Table --- */}
      <div className="glass-card card-execute p-6">
        <div className="mb-4">
          <h3 className="text-base font-display font-semibold text-white">
            Detailed Peer Comparison
          </h3>
          <p className="text-xs text-white/65 mt-0.5">
            Full breakdown of peer metrics
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white/50 font-display text-xs">
                Company
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Revenue (EUR M)
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Total tCO2e
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Intensity
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-right">
                Scope 3 %
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-center">
                SBTi
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs text-center">
                CDP Score
              </TableHead>
              <TableHead className="text-white/50 font-display text-xs">
                Reduction Target
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peers.map((peer) => {
              const isMeridian = peer.company === myName;
              return (
                <TableRow
                  key={peer.id}
                  className={`border-white/[0.08] transition-colors ${
                    isMeridian
                      ? "bg-[#0FD68C]/[0.06] border-l-2 border-l-[#0FD68C]/50"
                      : "hover:bg-white/[0.06]"
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isMeridian ? "text-[#0FD68C]" : "text-white/80"
                        }`}
                      >
                        {peer.company}
                      </span>
                      {isMeridian && (
                        <Badge className="bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30 text-[9px] border">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/70">
                    {fmt(peer.revenue)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono text-sm font-semibold ${
                      isMeridian ? "text-[#0FD68C]" : "text-white/70"
                    }`}
                  >
                    {fmt(peer.tCO2eTotal)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/60">
                    {peer.intensityPerRevenue.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/60">
                    {peer.scope3Pct}%
                  </TableCell>
                  <TableCell className="text-center">
                    {peer.sciApproved ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0FD68C]/20 text-[#0FD68C] text-[10px]">
                        &#10003;
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/40 text-[10px]">
                        &#8212;
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`${
                        CDP_COLORS[peer.cdpScore] ||
                        "bg-white/10 text-white/50 border-white/20"
                      } text-[10px] border font-mono`}
                    >
                      {peer.cdpScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-white/60">
                    {peer.reductionTarget}
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

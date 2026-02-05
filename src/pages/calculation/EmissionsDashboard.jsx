import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Factory, Zap, Truck, Globe, Lock, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useCompanyEmissionsSummary,
  useCompanyComputeResults,
  useCompanyProcurementData,
  useCompanyCompanyProfile,
} from "@/hooks/useCompanyData";

// ---------------------------------------------------------------------------
// Chart color constants
// ---------------------------------------------------------------------------
const SCOPE_COLORS = {
  "Scope 1": "#0FD68C",
  "Scope 2": "#2B5AEE",
  "Scope 3": "#0CC5D4",
};

const CATEGORY_PALETTE = [
  "#0FD68C",
  "#2B5AEE",
  "#0CC5D4",
  "#f59e0b",
  "#9366E8",
  "#ec4899",
  "#ef4444",
  "#64748b",
];

// ---------------------------------------------------------------------------
// Custom donut center label
// ---------------------------------------------------------------------------
function DonutCenterLabel({ viewBox, total }) {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white/50 text-[11px]"
        style={{ fontFamily: "Manrope" }}
      >
        Total
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white text-lg font-bold"
        style={{ fontFamily: "JetBrains Mono" }}
      >
        {total.toLocaleString()}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------
function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-xl border border-white/10">
      {label && (
        <p className="text-white/60 mb-1 font-medium">{label}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-white/80">{entry.name}:</span>
          <span className="font-mono font-semibold text-white">
            {Number(entry.value).toLocaleString()}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function EmissionsDashboard() {
  const insights = usePageInsights("emissions");
  const handoff = usePageHandoff("emissions");
  const summary = useCompanyEmissionsSummary();
  const { data: computeResults, loading: crLoading } = useCompanyComputeResults();
  const { data: procurement, loading: prLoading } = useCompanyProcurementData();
  const { loading: compLoading } = useCompanyCompanyProfile();

  const loading = crLoading || prLoading || compLoading;

  // --- Donut data ---
  const scopeDonut = useMemo(
    () => [
      { name: "Scope 1", value: summary.scope1 },
      { name: "Scope 2", value: summary.scope2 },
      { name: "Scope 3", value: summary.scope3 },
    ],
    [summary]
  );

  // --- Category bar data (top 8) ---
  const categoryBars = useMemo(() => {
    if (!computeResults) return [];
    const map = {};
    computeResults.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + r.tCO2e;
    });
    return Object.entries(map)
      .map(([category, tCO2e]) => ({ category, tCO2e }))
      .sort((a, b) => b.tCO2e - a.tCO2e)
      .slice(0, 8);
  }, [computeResults]);

  // --- Division stacked bar data ---
  const divisionData = useMemo(() => {
    if (!computeResults || !procurement) return [];
    // Build procurementId -> division lookup
    const divLookup = {};
    procurement.forEach((p) => {
      divLookup[p.id] = p.division;
    });
    const map = {};
    computeResults.forEach((r) => {
      const div = divLookup[r.procurementId] || "Other";
      if (!map[div]) map[div] = { division: div, "Scope 1": 0, "Scope 2": 0, "Scope 3": 0 };
      const scopeKey = r.scope; // "Scope 1" | "Scope 2" | "Scope 3"
      map[div][scopeKey] = (map[div][scopeKey] || 0) + r.tCO2e;
    });
    return Object.values(map);
  }, [computeResults, procurement]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Emissions Dashboard"
        subtitle="Scope 1, 2 & 3 GHG inventory overview"
        stage="calculation"
        actions={
          <>
            <AgentHandoffButton handoff={handoff} />
            <Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2">
              <Download className="h-3.5 w-3.5" />
              Export Data
            </Button>
          </>
        }
      />

      {/* Top metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Scope 1 - Direct"
          value={summary.scope1.toLocaleString()}
          unit="tCO2e"
          icon={Factory}
          variant="primary"
          trend="down"
          trendValue="-4.2%"
        />
        <MetricCard
          label="Scope 2 - Indirect Energy"
          value={summary.scope2.toLocaleString()}
          unit="tCO2e"
          icon={Zap}
          variant="secondary"
          trend="down"
          trendValue="-8.1%"
        />
        <MetricCard
          label="Scope 3 - Value Chain"
          value={summary.scope3.toLocaleString()}
          unit="tCO2e"
          icon={Truck}
          variant="warning"
          trend="up"
          trendValue="+2.3%"
        />
        <MetricCard
          label="Total Emissions"
          value={summary.total.toLocaleString()}
          unit="tCO2e"
          icon={Globe}
          variant="accent"
          trend="down"
          trendValue="-1.7%"
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      {/* Charts row: Donut + Category bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut */}
        <div className="glass-card card-calculate p-6 space-y-4">
          <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
            Scope Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scopeDonut}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {scopeDonut.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SCOPE_COLORS[entry.name]}
                    className="drop-shadow-md"
                  />
                ))}
                {/* Center label */}
                <Cell fill="transparent" />
              </Pie>
              <RechartsTooltip
                content={<ChartTooltip suffix=" tCO2e" />}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-white/70 ml-1">
                    {value} (
                    {(
                      ((scopeDonut.find((d) => d.name === value)?.value || 0) /
                        summary.total) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                )}
              />
              {/* Render center label using a hidden Pie layer */}
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={0}
                dataKey="value"
                isAnimationActive={false}
              >
                <Cell fill="transparent" />
                <DonutCenterLabel total={summary.total} viewBox={{}} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Fallback center label overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: "none" }} />
        </div>

        {/* Category horizontal bar chart */}
        <div className="glass-card card-calculate p-6 space-y-4">
          <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
            Top Categories by tCO2e
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryBars}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={110}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Manrope" }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip content={<ChartTooltip suffix=" tCO2e" />} />
              <Bar dataKey="tCO2e" name="Emissions" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {categoryBars.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Division stacked bar chart */}
      <div className="glass-card card-calculate p-6 space-y-4">
        <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
          Emissions by Division
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={divisionData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="division"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "Manrope" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip content={<ChartTooltip suffix=" tCO2e" />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-white/70 ml-1">{value}</span>
              )}
            />
            <Bar dataKey="Scope 1" stackId="stack" fill={SCOPE_COLORS["Scope 1"]} radius={[0, 0, 0, 0]} maxBarSize={56} />
            <Bar dataKey="Scope 2" stackId="stack" fill={SCOPE_COLORS["Scope 2"]} radius={[0, 0, 0, 0]} maxBarSize={56} />
            <Bar dataKey="Scope 3" stackId="stack" fill={SCOPE_COLORS["Scope 3"]} radius={[4, 4, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

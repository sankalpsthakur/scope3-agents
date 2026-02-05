import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Database,
  Link2,
  AlertTriangle,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useCompanyEmissionFactors,
  useCompanyProcurementData,
} from "@/hooks/useCompanyData";

// ---------------------------------------------------------------------------
// Source badge styles
// ---------------------------------------------------------------------------
const SOURCE_STYLES = {
  DEFRA: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  ecoinvent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  GaBi: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  GLEC: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

const CONFIDENCE_STYLES = {
  High: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-red-500/15 text-red-400 border-red-500/30",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function FactorMapping() {
  const { data: factors, loading: fLoading } = useCompanyEmissionFactors();
  const { data: procurement, loading: pLoading } = useCompanyProcurementData();
  const [toastShown, setToastShown] = useState(false);

  const loading = fLoading || pLoading;

  // Mapping analysis
  const mappingStats = useMemo(() => {
    if (!factors || !procurement) return { total: 0, mapped: 0, unmapped: 0, avgConf: 0, unmappedCats: [] };
    const factorIds = new Set(factors.map((f) => f.id));
    const mapped = procurement.filter((p) => factorIds.has(p.emissionFactorId)).length;
    const unmapped = procurement.length - mapped;

    // Avg confidence
    const confMap = { High: 1, Medium: 0.66, Low: 0.33 };
    const avgConf =
      factors.reduce((s, f) => s + (confMap[f.confidence] || 0.5), 0) / factors.length;

    // Unmapped categories (items without a valid factor)
    const unmappedCats = [];
    procurement.forEach((p) => {
      if (!factorIds.has(p.emissionFactorId) && !unmappedCats.includes(p.category)) {
        unmappedCats.push(p.category);
      }
    });

    return {
      total: factors.length,
      mapped,
      unmapped,
      avgConf: Math.round(avgConf * 100),
      unmappedCats,
    };
  }, [factors, procurement]);

  const mappedPct = useMemo(() => {
    if (!procurement) return 0;
    return Math.round((mappingStats.mapped / procurement.length) * 100);
  }, [mappingStats, procurement]);

  const donutData = useMemo(
    () => [
      { name: "Mapped", value: mappingStats.mapped },
      { name: "Unmapped", value: mappingStats.unmapped },
    ],
    [mappingStats]
  );

  const handleAutoMap = () => {
    setToastShown(true);
    setTimeout(() => setToastShown(false), 3000);
  };

  if (loading) return <LoadingState rows={8} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Factor Mapping"
        subtitle="Emission factor database & procurement mapping status"
        stage="calculation"
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Factors"
          value={mappingStats.total}
          icon={Database}
          variant="default"
        />
        <MetricCard
          label="Mapped Rows"
          value={mappingStats.mapped}
          icon={Link2}
          variant="primary"
        />
        <MetricCard
          label="Unmapped Rows"
          value={mappingStats.unmapped}
          icon={AlertTriangle}
          variant={mappingStats.unmapped > 0 ? "warning" : "default"}
        />
        <MetricCard
          label="Avg Confidence"
          value={`${mappingStats.avgConf}%`}
          icon={ShieldCheck}
          variant="accent"
        />
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* LEFT: Factor database table (60%) */}
        <div className="xl:col-span-3 glass-card card-calculate overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
              Factor Database
            </h4>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                  Factor Name
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                  Category
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider text-right">
                  Value
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                  Unit
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                  Source
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden lg:table-cell">
                  Region
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                  Confidence
                </TableHead>
                <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden md:table-cell">
                  Year
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factors.map((f, idx) => (
                <TableRow
                  key={f.id}
                  className={`border-white/[0.12] transition-colors ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.05]"
                  } hover:bg-white/[0.10]`}
                >
                  <TableCell className="font-medium text-white/90 text-sm max-w-[200px]">
                    {f.name}
                  </TableCell>
                  <TableCell className="text-sm text-white/60">
                    {f.category}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm text-white/90 tabular-nums">
                    {f.value}
                  </TableCell>
                  <TableCell className="text-sm text-white/60 font-mono">
                    {f.unit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] font-medium border ${
                        SOURCE_STYLES[f.source] || "bg-white/10 text-white/60 border-white/20"
                      }`}
                    >
                      {f.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-white/60 hidden lg:table-cell">
                    {f.region}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] font-medium border ${
                        CONFIDENCE_STYLES[f.confidence] || ""
                      }`}
                    >
                      {f.confidence}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-white/60 hidden md:table-cell">
                    {f.year}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RIGHT: Mapping status (40%) */}
        <div className="xl:col-span-2 space-y-4">
          {/* Circular progress chart */}
          <div className="glass-card card-calculate p-6 flex flex-col items-center space-y-4">
            <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide self-start">
              Mapping Status
            </h4>
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="rgba(255,255,255,0.08)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-bold text-white">
                  {mappedPct}%
                </span>
                <span className="text-xs text-white/60">Mapped</span>
              </div>
            </div>

            <div className="w-full space-y-1 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Mapped
                </span>
                <span className="font-mono">{mappingStats.mapped}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  Unmapped
                </span>
                <span className="font-mono">{mappingStats.unmapped}</span>
              </div>
            </div>
          </div>

          {/* Unmapped categories */}
          {mappingStats.unmappedCats.length > 0 && (
            <div className="glass-card p-5 space-y-3">
              <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
                Unmapped Categories
              </h4>
              <div className="space-y-2">
                {mappingStats.unmappedCats.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2 text-sm text-amber-400/90"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No unmapped -- show all-good card */}
          {mappingStats.unmappedCats.length === 0 && mappingStats.unmapped === 0 && (
            <div className="glass-card p-5 space-y-2 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-medium">All categories mapped</span>
              </div>
              <p className="text-xs text-white/60">
                Every procurement record has a matched emission factor.
              </p>
            </div>
          )}

          {/* Auto-map button */}
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={handleAutoMap}
          >
            <Wand2 className="h-4 w-4" />
            Auto-Map Remaining
          </Button>

          {/* Toast */}
          {toastShown && (
            <div className="glass-card p-3 border-emerald-500/20 animate-fade-in-up">
              <p className="text-sm text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Auto-mapping complete. All factors assigned.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

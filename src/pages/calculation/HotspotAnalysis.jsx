import React, { useMemo, useState } from "react";
import {
  Treemap,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  Clock,
  FileQuestion,
  CheckCircle2,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useCompanyHotspots,
  useCompanyGapAnalysis,
  useCompanyAuditTrail,
} from "@/hooks/useCompanyData";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TREEMAP_PALETTE = [
  "#0FD68C",
  "#2B5AEE",
  "#9366E8",
  "#f59e0b",
  "#0CC5D4",
  "#ec4899",
  "#ef4444",
];

const ISSUE_TYPE_STYLES = {
  Unmapped: { bg: "bg-red-500/15 text-red-400 border-red-500/30", icon: AlertCircle },
  "Low Quality": { bg: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle },
  "Missing Data": { bg: "bg-orange-500/15 text-orange-400 border-orange-500/30", icon: FileQuestion },
  "Stale Factor": { bg: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30", icon: Clock },
};

const IMPACT_STYLES = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-[#0FD68C]/15 text-[#0FD68C] border-[#0FD68C]/30",
};

const REDUCTION_STYLES = {
  High: "bg-[#0FD68C]/15 text-[#0FD68C] border-[#0FD68C]/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-white/10 text-white/50 border-white/20",
};

// ---------------------------------------------------------------------------
// Trend icon helper
// ---------------------------------------------------------------------------
function TrendIcon({ trend }) {
  if (trend === "up")
    return <TrendingUp className="h-4 w-4 text-red-400" />;
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-[#0FD68C]" />;
  return <Minus className="h-4 w-4 text-white/50" />;
}

// ---------------------------------------------------------------------------
// Custom Treemap content
// ---------------------------------------------------------------------------
function CustomTreemapContent({ x, y, width, height, index, name, value }) {
  if (width < 40 || height < 30) return null;
  const fill = TREEMAP_PALETTE[index % TREEMAP_PALETTE.length];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill={fill}
        fillOpacity={0.75}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={2}
        className="transition-all duration-200 hover:fill-opacity-100"
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontFamily="Manrope"
            fontWeight={600}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize={11}
            fontFamily="JetBrains Mono"
          >
            {Number(value).toLocaleString()}
          </text>
        </>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Treemap Tooltip
// ---------------------------------------------------------------------------
function TreemapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-xl border border-white/10">
      <p className="text-white font-medium">{d.name}</p>
      <p className="text-white/70 font-mono">
        {Number(d.value).toLocaleString()} tCO2e
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Format timestamp
// ---------------------------------------------------------------------------
function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Actor badge
// ---------------------------------------------------------------------------
function ActorBadge({ actor }) {
  const isSystem = actor === "System";
  return (
    <Badge
      className={cn(
        "text-[10px] border font-medium",
        isSystem
          ? "bg-[#0CC5D4]/15 text-[#0CC5D4] border-[#0CC5D4]/30"
          : "bg-purple-500/15 text-purple-400 border-purple-500/30"
      )}
    >
      {actor}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function HotspotAnalysis() {
  const insights = usePageInsights("hotspots");
  const handoff = usePageHandoff("hotspots");
  const { data: hotspots, loading: hLoading } = useCompanyHotspots();
  const { data: gaps, loading: gLoading } = useCompanyGapAnalysis();
  const { data: audit, loading: aLoading } = useCompanyAuditTrail();

  const loading = hLoading || gLoading || aLoading;

  // Treemap data
  const treemapData = useMemo(() => {
    if (!hotspots) return [];
    return hotspots.map((h) => ({
      name: h.category,
      value: h.tCO2e,
    }));
  }, [hotspots]);

  // Sorted hotspots by tCO2e descending
  const sortedHotspots = useMemo(() => {
    if (!hotspots) return [];
    return [...hotspots].sort((a, b) => b.tCO2e - a.tCO2e);
  }, [hotspots]);

  // Max tCO2e for bar scale
  const maxEmissions = useMemo(() => {
    if (!sortedHotspots.length) return 1;
    return sortedHotspots[0].tCO2e;
  }, [sortedHotspots]);

  // Audit sorted by timestamp descending
  const sortedAudit = useMemo(() => {
    if (!audit) return [];
    return [...audit].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [audit]);

  // Resolved state for gaps (demo)
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const handleResolve = (id) => {
    setResolvedIds((prev) => new Set([...prev, id]));
  };

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hotspot Analysis"
        subtitle="Identify top emission sources & data gaps"
        stage="calculation"
        actions={
          <>
            <AgentHandoffButton handoff={handoff} />
            <Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              Set Alerts
            </Button>
          </>
        }
      />

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      <Tabs defaultValue="hotspots" className="space-y-6">
        <TabsList className="bg-white/[0.10] border border-white/10">
          <TabsTrigger value="hotspots" className="data-[state=active]:bg-[#0FD68C]/20 data-[state=active]:text-[#0FD68C]">
            Hotspots
          </TabsTrigger>
          <TabsTrigger value="gaps" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-[#2B5AEE]/20 data-[state=active]:text-[#2B5AEE]">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* ================================================================
            Hotspots Tab
            ================================================================ */}
        <TabsContent value="hotspots" className="space-y-6">
          {/* Treemap */}
          <div className="glass-card card-calculate p-6 space-y-4">
            <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
              Category Treemap by tCO2e
            </h4>
            <ResponsiveContainer width="100%" height={320}>
              <Treemap
                data={treemapData}
                dataKey="value"
                nameKey="name"
                content={<CustomTreemapContent />}
                animationDuration={600}
              >
                <RechartsTooltip content={<TreemapTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>

          {/* Hotspot table */}
          <div className="glass-card card-calculate overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider w-12">
                    Rank
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                    tCO2e
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider text-right">
                    % of Total
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider text-center">
                    Trend
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden md:table-cell">
                    Top Supplier
                  </TableHead>
                  <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                    Reduction Potential
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHotspots.map((h, idx) => {
                  const barWidth = Math.max((h.tCO2e / maxEmissions) * 100, 2);
                  const gradientOpacity = Math.max(0.03, (h.pctOfTotal / 50) * 0.08);
                  return (
                    <TableRow
                      key={h.id}
                      className="border-white/[0.12] hover:bg-white/[0.10] transition-colors"
                      style={{
                        background: `linear-gradient(90deg, rgba(15,214,140,${gradientOpacity}) 0%, transparent ${Math.min(h.pctOfTotal * 2, 100)}%)`,
                      }}
                    >
                      <TableCell className="font-mono text-sm text-white/50 text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium text-sm text-white/90">
                        {h.category}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-white/[0.10] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#0FD68C]/70 transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="font-mono text-white/90 tabular-nums">
                            {h.tCO2e.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-white/70 tabular-nums">
                        {h.pctOfTotal.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <TrendIcon trend={h.trend} />
                      </TableCell>
                      <TableCell className="text-sm text-white/60 hidden md:table-cell">
                        {h.topSupplier}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] border font-medium",
                            REDUCTION_STYLES[h.reductionPotential] || ""
                          )}
                        >
                          {h.reductionPotential}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ================================================================
            Gap Analysis Tab
            ================================================================ */}
        <TabsContent value="gaps" className="space-y-4">
          {gaps.map((gap) => {
            const resolved = resolvedIds.has(gap.id);
            const typeConfig = ISSUE_TYPE_STYLES[gap.issueType] || ISSUE_TYPE_STYLES["Low Quality"];
            const TypeIcon = typeConfig.icon;
            return (
              <div
                key={gap.id}
                className={cn(
                  "glass-card p-5 space-y-3 transition-all duration-300",
                  resolved && "opacity-50"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.10]">
                      <TypeIcon className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-[10px] border font-medium", typeConfig.bg)}>
                          {gap.issueType}
                        </Badge>
                        <Badge className={cn("text-[10px] border font-medium", IMPACT_STYLES[gap.estimatedImpact] || "")}>
                          {gap.estimatedImpact} Impact
                        </Badge>
                        <span className="text-xs text-white/50">{gap.category}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resolved}
                    onClick={() => handleResolve(gap.id)}
                    className="shrink-0"
                  >
                    {resolved ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#0FD68C]" />
                        Resolved
                      </>
                    ) : (
                      "Resolve"
                    )}
                  </Button>
                </div>

                <p className="text-sm text-white/70 leading-relaxed pl-11">
                  {gap.description}
                </p>

                <div className="pl-11 pt-1">
                  <p className="text-xs text-white/50 uppercase tracking-wider font-display mb-1">
                    Recommendation
                  </p>
                  <p className="text-sm text-[#0CC5D4]/80">
                    {gap.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* ================================================================
            Audit Trail Tab
            ================================================================ */}
        <TabsContent value="audit" className="space-y-0">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="h-4 w-4 text-white/50" />
              <h4 className="text-sm font-display font-semibold text-white/80 uppercase tracking-wide">
                Activity Timeline
              </h4>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/10" />

              <div className="space-y-0">
                {sortedAudit.map((event, idx) => (
                  <div
                    key={event.id}
                    className="relative flex gap-4 pb-6 last:pb-0 group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Dot on the line */}
                    <div className="relative z-10 flex h-[35px] w-[35px] items-center justify-center shrink-0">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full ring-4 ring-background transition-all",
                          event.actor === "System"
                            ? "bg-[#0CC5D4] shadow-[0_0_8px_rgba(12,197,212,0.4)]"
                            : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4 border-b border-white/[0.08] group-last:border-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[11px] text-white/50 tabular-nums">
                          {formatTimestamp(event.timestamp)}
                        </span>
                        <ActorBadge actor={event.actor} />
                        <Badge className="text-[10px] bg-white/[0.10] text-white/50 border border-white/10">
                          {event.version}
                        </Badge>
                      </div>

                      <p className="text-sm text-white/80 font-medium">
                        {event.action}
                      </p>

                      <p className="text-xs text-white/50 mt-0.5">
                        {event.details}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-white/30 font-display uppercase tracking-wider">
                          {event.entity}
                        </span>
                        <span className="text-[10px] text-white/20">/</span>
                        <span className="text-[10px] font-mono text-white/50">
                          {event.entityId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

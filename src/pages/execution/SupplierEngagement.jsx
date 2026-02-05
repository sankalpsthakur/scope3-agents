import React, { useMemo, useState } from "react";
import {
  Users,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  ChevronRight,
  X,
  Mail,
  Video,
  Globe,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useCompanySupplierProfiles,
  useCompanyEngagementTracking,
} from "@/hooks/useCompanyData";

const COUNTRY_FLAGS = {
  Germany: "\u{1F1E9}\u{1F1EA}",
  France: "\u{1F1EB}\u{1F1F7}",
  Netherlands: "\u{1F1F3}\u{1F1F1}",
  Denmark: "\u{1F1E9}\u{1F1F0}",
  "South Korea": "\u{1F1F0}\u{1F1F7}",
  Luxembourg: "\u{1F1F1}\u{1F1FA}",
  Taiwan: "\u{1F1F9}\u{1F1FC}",
};

const ENGAGEMENT_STATUS_STYLES = {
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Invited: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Not Started": "bg-white/10 text-white/50 border-white/20",
  Completed: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const RISK_STYLES = {
  Low: "text-emerald-400",
  Medium: "text-amber-400",
  High: "text-red-400",
};

const CHANNEL_ICON = {
  Email: Mail,
  Meeting: Video,
  Portal: Globe,
  Internal: Building2,
  External: Globe,
};

const TRACK_STATUS_STYLES = {
  Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function fmtEur(n) {
  if (n >= 1000000) return `EUR ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `EUR ${(n / 1000).toFixed(0)}K`;
  return `EUR ${fmt(n)}`;
}

export default function SupplierEngagement() {
  const { data: suppliers, loading: supLoading } = useCompanySupplierProfiles();
  const { data: engagements, loading: engLoading } = useCompanyEngagementTracking();
  const [tab, setTab] = useState("All");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const stats = useMemo(() => {
    if (!suppliers) return { active: 0, responseRate: 0, sciApproved: 0, highRisk: 0 };
    const active = suppliers.filter((s) => s.engagementStatus === "Active").length;
    const withRate = suppliers.filter((s) => s.responseRate > 0);
    const avgRate =
      withRate.length > 0
        ? Math.round(withRate.reduce((a, s) => a + s.responseRate, 0) / withRate.length)
        : 0;
    const sciApproved = suppliers.filter((s) => s.sciTarget).length;
    const highRisk = suppliers.filter((s) => s.riskLevel === "High").length;
    return { active, responseRate: avgRate, sciApproved, highRisk };
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];
    if (tab === "All") return suppliers;
    return suppliers.filter((s) => s.engagementStatus === tab);
  }, [suppliers, tab]);

  const supplierTimeline = useMemo(() => {
    if (!engagements || !selectedSupplier) return [];
    return engagements
      .filter((e) => e.supplierId === selectedSupplier.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [engagements, selectedSupplier]);

  if (supLoading || engLoading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Supplier Engagement"
        subtitle="Collaborate with suppliers to reduce Scope 3 emissions"
        stage="execution"
      />

      {/* --- Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Engagements"
          value={stats.active}
          icon={Users}
          variant="primary"
          trend="up"
          trendValue={`of ${suppliers.length} total`}
        />
        <MetricCard
          label="Avg Response Rate"
          value={`${stats.responseRate}%`}
          icon={MessageSquare}
          variant="secondary"
          trend="up"
          trendValue="+5% vs Q2"
        />
        <MetricCard
          label="SCI-Approved Suppliers"
          value={stats.sciApproved}
          icon={ShieldCheck}
          variant="accent"
        />
        <MetricCard
          label="High-Risk Suppliers"
          value={stats.highRisk}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* --- Filter Tabs --- */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white/5 border border-white/10">
          {["All", "Active", "Invited", "Not Started", "Completed"].map(
            (t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                {t}
                {suppliers && (
                  <span className="ml-1.5 font-mono text-[10px] opacity-60">
                    {t === "All"
                      ? suppliers.length
                      : suppliers.filter((s) => s.engagementStatus === t).length}
                  </span>
                )}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="flex gap-4">
            {/* --- Supplier Cards Grid --- */}
            <div
              className={`grid grid-cols-1 ${
                selectedSupplier ? "lg:grid-cols-1 xl:grid-cols-2" : "lg:grid-cols-2"
              } gap-4 flex-1 transition-all duration-300`}
            >
              {filteredSuppliers.map((supplier) => {
                const isSelected = selectedSupplier?.id === supplier.id;
                return (
                  <div
                    key={supplier.id}
                    onClick={() =>
                      setSelectedSupplier(isSelected ? null : supplier)
                    }
                    className={`glass-card p-5 cursor-pointer transition-all duration-200 hover:bg-white/[0.12] ${
                      isSelected
                        ? "border-emerald-500/40 glow-primary"
                        : ""
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-base font-display font-semibold text-white tracking-tight">
                          {supplier.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">
                            {COUNTRY_FLAGS[supplier.country] || "\u{1F30D}"}{" "}
                          </span>
                          <span className="text-xs text-white/50">
                            {supplier.country}
                          </span>
                          <Separator orientation="vertical" className="h-3 bg-white/10" />
                          <span className="text-xs text-white/50">
                            {supplier.category}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          ENGAGEMENT_STATUS_STYLES[supplier.engagementStatus]
                        } text-[10px] border`}
                      >
                        {supplier.engagementStatus}
                      </Badge>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                          Annual Spend
                        </span>
                        <p className="text-sm font-mono font-bold text-white/90">
                          {fmtEur(supplier.annualSpend)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                          Emissions
                        </span>
                        <p className="text-sm font-mono font-bold text-white/90">
                          {fmt(supplier.tCO2e)}{" "}
                          <span className="text-[10px] font-normal text-white/40">
                            tCO2e
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08]">
                      {/* SCI Target */}
                      <div
                        className={`flex items-center gap-1 text-[10px] ${
                          supplier.sciTarget
                            ? "text-emerald-400"
                            : "text-white/40"
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span>SBTi</span>
                      </div>

                      {/* Risk Level */}
                      <div
                        className={`flex items-center gap-1 text-[10px] ${
                          RISK_STYLES[supplier.riskLevel]
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>{supplier.riskLevel}</span>
                      </div>

                      {/* Reduction Commitment */}
                      <span className="text-[10px] text-white/40 ml-auto truncate max-w-[120px]">
                        {supplier.reductionCommitment}
                      </span>

                      {/* Last Contact */}
                      {supplier.lastContact && (
                        <div className="flex items-center gap-1 text-[10px] text-white/40 shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span className="font-mono">
                            {supplier.lastContact}
                          </span>
                        </div>
                      )}

                      <ChevronRight className="h-3 w-3 text-white/40 shrink-0" />
                    </div>
                  </div>
                );
              })}
              {filteredSuppliers.length === 0 && (
                <div className="col-span-full glass-card p-8 text-center">
                  <p className="text-sm text-white/65">
                    No suppliers matching this filter.
                  </p>
                </div>
              )}
            </div>

            {/* --- Right Panel: Engagement Timeline --- */}
            {selectedSupplier && (
              <div className="w-[380px] shrink-0 glass-card p-5 animate-slide-in-right hidden lg:flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-display font-semibold text-white">
                      {selectedSupplier.name}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      Engagement Timeline
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setSelectedSupplier(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <ScrollArea className="flex-1" style={{ maxHeight: 500 }}>
                  {supplierTimeline.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-white/40">
                        No engagement records yet.
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4">
                      {/* Timeline line */}
                      <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />

                      {supplierTimeline.map((eng) => {
                        const ChannelIcon =
                          CHANNEL_ICON[eng.channel] || MessageSquare;
                        return (
                          <div key={eng.id} className="relative">
                            {/* Dot */}
                            <div
                              className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                                eng.status === "Completed"
                                  ? "bg-emerald-500 border-emerald-500/50"
                                  : eng.status === "In Progress"
                                  ? "bg-sky-500 border-sky-500/50"
                                  : "bg-amber-500 border-amber-500/50"
                              }`}
                            />
                            <div className="glass-subtle rounded-lg p-3 hover:bg-white/[0.08] transition-colors">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-xs font-medium text-white/90 leading-snug">
                                  {eng.action}
                                </p>
                                <Badge
                                  className={`${
                                    TRACK_STATUS_STYLES[eng.status] ||
                                    "bg-white/10 text-white/50 border-white/20"
                                  } text-[9px] border shrink-0`}
                                >
                                  {eng.status}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-white/40 mb-1.5">
                                {eng.notes}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-white/40">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-mono">{eng.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ChannelIcon className="h-3 w-3" />
                                  <span>{eng.channel}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

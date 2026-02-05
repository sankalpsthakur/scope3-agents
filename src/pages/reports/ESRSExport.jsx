import React, { useMemo, useState } from "react";
import {
  FileOutput,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCompanyESRSKPIs, useCompanyIRORegister, useCompanyEmissionsSummary } from "@/hooks/useCompanyData";
import { useCompany } from "@/context/CompanyContext";

const DISCLOSURE_REQUIREMENTS = [
  { id: "DR-E1-1", standard: "E1", code: "E1-1", name: "Transition plan for climate change mitigation", category: "Environmental" },
  { id: "DR-E1-4", standard: "E1", code: "E1-4", name: "Total GHG emissions", category: "Environmental" },
  { id: "DR-E1-5", standard: "E1", code: "E1-5", name: "Energy consumption and mix", category: "Environmental" },
  { id: "DR-E1-6", standard: "E1", code: "E1-6", name: "GHG intensity per net revenue", category: "Environmental" },
  { id: "DR-E2-1", standard: "E2", code: "E2-1", name: "Pollution of air, water and soil", category: "Environmental" },
  { id: "DR-E3-1", standard: "E3", code: "E3-1", name: "Water consumption in areas at water risk", category: "Environmental" },
  { id: "DR-E4-1", standard: "E4", code: "E4-1", name: "Impact metrics related to biodiversity", category: "Environmental" },
  { id: "DR-E5-1", standard: "E5", code: "E5-1", name: "Resource inflows and outflows", category: "Environmental" },
  { id: "DR-S1-1", standard: "S1", code: "S1-1", name: "Policies related to own workforce", category: "Social" },
  { id: "DR-S1-6", standard: "S1", code: "S1-6", name: "Characteristics of the undertaking's employees - pay gap", category: "Social" },
  { id: "DR-S2-1", standard: "S2", code: "S2-1", name: "Policies related to value chain workers", category: "Social" },
  { id: "DR-S4-1", standard: "S4", code: "S4-1", name: "Policies related to consumers and end-users", category: "Social" },
  { id: "DR-G1-1", standard: "G1", code: "G1-1", name: "Business conduct policies", category: "Governance" },
  { id: "DR-G1-4", standard: "G1", code: "G1-4", name: "Incidents of corruption or bribery", category: "Governance" },
];

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function buildPreviewDisclosures(emissions) {
  const s1 = fmt(emissions.scope1);
  const s2 = fmt(emissions.scope2);
  const s3 = fmt(emissions.scope3);
  const total = fmt(emissions.total);
  const s3pct = Math.round((emissions.scope3 / emissions.total) * 100);

  return [
    {
      code: "E1-4",
      title: "Total GHG Emissions",
      body: `The undertaking's total greenhouse gas emissions for the reporting period FY2024 amounted to ${total} tCO2e, comprising:
- Scope 1 (direct emissions): ${s1} tCO2e from owned/controlled sources including on-site combustion, process emissions, and company fleet.
- Scope 2 (indirect, energy): ${s2} tCO2e from purchased electricity, steam, heating/cooling (location-based method).
- Scope 3 (value chain): ${s3} tCO2e (${s3pct}% of total) across material categories.

Total emissions are tracked against a 2022 baseline, targeting a 30% absolute reduction by 2030 aligned with a 1.5C pathway. Data quality score: 0.82 (weighted average across all computation line items).`,
    },
    {
      code: "S1-6",
      title: "Pay Gap - Own Workforce",
      body: `The gender pay gap across all employees stood at 8.2% (mean) for the reporting period, down from 9.4% in the prior year. The median pay gap is 6.1%. The undertaking has set a target to reduce the mean pay gap to 3.0% by 2027. Key actions include:
- Annual pay equity audits conducted by external provider (Mercer).
- Targeted salary adjustments for identified gaps in engineering and management roles.
- Enhanced parental leave policy (gender-neutral 6 months at full pay).

Breakdown by workforce category: Management 11.2%, Technical 7.8%, Administrative 4.1%, Production 3.6%.`,
    },
    {
      code: "G1-1",
      title: "Business Conduct Policies",
      body: `The undertaking maintains a comprehensive Code of Business Conduct approved by the Management Board and reviewed annually. The policy covers anti-corruption, anti-competitive behavior, data protection, whistleblower protection, and responsible lobbying.

Training completion rate: 97% of all employees completed mandatory annual training on business conduct. Ethics hotline reports resolved: 94% within 30 days. The undertaking has zero tolerance for bribery and corruption, with mandatory due diligence for all third-party intermediaries in high-risk jurisdictions.`,
    },
  ];
}

const STATUS_STYLES = {
  Complete: "bg-[#0FD68C]/15 text-[#0FD68C] border-[#0FD68C]/25",
  Partial: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Missing: "bg-red-500/15 text-red-400 border-red-500/25",
};

const STANDARD_BADGE = {
  E: "bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30",
  S: "bg-[#2B5AEE]/20 text-[#2B5AEE] border-[#2B5AEE]/30",
  G: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

function qualityScore(kpis) {
  if (!kpis || kpis.length === 0) return 0;
  const high = kpis.filter((k) => k.confidence === "High").length;
  const med = kpis.filter((k) => k.confidence === "Medium").length;
  return Math.round(((high * 1 + med * 0.6) / kpis.length) * 100);
}

export default function ESRSExport() {
  const insights = usePageInsights("export");
  const handoff = usePageHandoff("export");
  const { data: kpis, loading: kpiLoading } = useCompanyESRSKPIs();
  const { loading: iroLoading } = useCompanyIRORegister();
  const emissions = useCompanyEmissionsSummary();
  const { company } = useCompany();
  const [format, setFormat] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("disclosures");
  const [exportDialogOpen] = useState(false);

  const loading = kpiLoading || iroLoading;

  const disclosures = useMemo(() => {
    if (!kpis) return DISCLOSURE_REQUIREMENTS.map((d) => ({ ...d, status: "Missing", quality: 0 }));

    return DISCLOSURE_REQUIREMENTS.map((d) => {
      const stdKpis = kpis.filter((k) => k.standard === d.standard);
      const hasData = stdKpis.some((k) => k.value > 0);
      const highConf = stdKpis.filter((k) => k.confidence === "High").length;
      const total = stdKpis.length;
      const quality = qualityScore(stdKpis);

      let status = "Missing";
      if (hasData && highConf === total) status = "Complete";
      else if (hasData) status = "Partial";

      return { ...d, status, quality };
    });
  }, [kpis]);

  const filtered = useMemo(() => {
    return disclosures.filter((d) => {
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;
      return true;
    });
  }, [disclosures, categoryFilter]);

  const counts = useMemo(() => {
    const complete = disclosures.filter((d) => d.status === "Complete").length;
    const partial = disclosures.filter((d) => d.status === "Partial").length;
    const missing = disclosures.filter((d) => d.status === "Missing").length;
    return { complete, partial, missing, total: disclosures.length };
  }, [disclosures]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="ESRS Export"
        subtitle={`Prepare and export ESRS-compliant disclosures for ${company.name}`}
        stage="reports"
        actions={<><AgentHandoffButton handoff={handoff} /><Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2"><FileOutput className="h-3.5 w-3.5" />Preview</Button></>}
      />

      {exportDialogOpen && (
        <div className="glass-card p-5 border-[#9366E8]/20 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#9366E8]/15 text-[#9366E8]">
              <FileOutput className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#9366E8]">Export Configuration</p>
              <p className="text-xs text-white/50">Demo mode - no files will be generated</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0FD68C]/10 border border-[#0FD68C]/20">
            <CheckCircle2 className="h-4 w-4 text-[#0FD68C] shrink-0" />
            <p className="text-xs text-white/60">
              {counts.complete} of {counts.total} disclosures ready.{" "}
              {counts.partial > 0 && `${counts.partial} partially complete. `}
              {counts.missing > 0 && `${counts.missing} require additional data.`}
            </p>
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-white/45" />
          <span className="text-xs text-white/50">Format:</span>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white/[0.08] border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(0,0%,10%)] border-white/10">
              <SelectItem value="all" className="text-xs">All Formats</SelectItem>
              <SelectItem value="xbrl" className="text-xs">XBRL</SelectItem>
              <SelectItem value="pdf" className="text-xs">PDF</SelectItem>
              <SelectItem value="csv" className="text-xs">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Category:</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-white/[0.08] border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(0,0%,10%)] border-white/10">
              <SelectItem value="all" className="text-xs">All</SelectItem>
              <SelectItem value="Environmental" className="text-xs">Environmental</SelectItem>
              <SelectItem value="Social" className="text-xs">Social</SelectItem>
              <SelectItem value="Governance" className="text-xs">Governance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-[#0FD68C]" />
            <span className="text-white/50">{counts.complete} Complete</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-400" />
            <span className="text-white/50">{counts.partial} Partial</span>
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.08] border border-white/[0.12]">
          <TabsTrigger
            value="disclosures"
            className="text-xs data-[state=active]:bg-[#9366E8]/20 data-[state=active]:text-[#9366E8] gap-1.5"
          >
            <FileOutput className="h-3.5 w-3.5" />
            Disclosures
            <Badge className="bg-white/5 text-white/50 border-white/10 text-[9px] border ml-1">
              {filtered.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="text-xs data-[state=active]:bg-[#9366E8]/20 data-[state=active]:text-[#9366E8] gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disclosures" className="mt-4">
          <div className="glass-card card-report overflow-hidden">
            <ScrollArea className="h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.12] hover:bg-transparent">
                    <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[80px]">
                      Standard
                    </TableHead>
                    <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[80px]">
                      Disclosure
                    </TableHead>
                    <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider">
                      Description
                    </TableHead>
                    <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[100px] text-right">
                      Quality Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((d) => {
                    const catKey = d.standard[0];
                    return (
                      <TableRow key={d.id} className="border-white/[0.08] hover:bg-white/[0.08]">
                        <TableCell>
                          <Badge className={STANDARD_BADGE[catKey] + " text-[10px] font-mono font-bold border"}>
                            {d.standard}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-white/60">
                          {d.code}
                        </TableCell>
                        <TableCell className="text-xs text-white/70">
                          {d.name}
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_STYLES[d.status] + " text-[9px] border"}>
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`text-xs font-mono font-bold ${
                              d.quality >= 80
                                ? "text-[#0FD68C]"
                                : d.quality >= 50
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {d.quality}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="space-y-4">
            {buildPreviewDisclosures(emissions).map((disc) => (
              <div key={disc.code} className="glass-card card-report p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#9366E8]/20 text-[#9366E8] border-[#9366E8]/30 text-[10px] font-mono font-bold border">
                    {disc.code}
                  </Badge>
                  <span className="text-sm font-medium text-white/90">{disc.title}</span>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <pre className="text-xs text-white/60 whitespace-pre-wrap font-sans leading-relaxed">
                    {disc.body}
                  </pre>
                </div>
              </div>
            ))}
            <div className="glass-card p-8 text-center">
              <p className="text-xs text-white/45">
                Additional disclosure previews will be generated based on collected data.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

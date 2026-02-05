import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  User,
  Activity,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCompanyAuditTrail } from "@/hooks/useCompanyData";

const REPORT_AUDIT_ENTRIES = [
  {
    id: "AT-RPT-001",
    timestamp: "2025-01-17T09:00:00Z",
    actor: "System",
    action: "Report generated",
    entity: "Report",
    entityId: "RPT-ESRS-2024",
    details: "ESRS annual report generated for FY2024",
    version: "v1.0",
  },
  {
    id: "AT-RPT-002",
    timestamp: "2025-01-17T10:30:00Z",
    actor: "Anna Mueller",
    action: "Export initiated",
    entity: "Export",
    entityId: "EXP-XBRL-001",
    details: "XBRL export of E1-E5 disclosures",
    version: "v1.0",
  },
];

const ACTION_STYLES = {
  "Data imported": "bg-sky-500/15 text-sky-400 border-sky-500/25",
  "Auto-mapping completed": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Manual mapping": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Computation triggered": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Computation completed": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Hotspot analysis generated": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Gap analysis generated": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "Review approved": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Report snapshot": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Report generated": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Export initiated": "bg-sky-500/15 text-sky-400 border-sky-500/25",
};

const DEFAULT_ACTION_STYLE = "bg-white/10 text-white/60 border-white/15";

function formatTimestamp(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

function truncate(str, max = 60) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + "...";
}

export default function AuditTrail() {
  const { data: rawAudit, loading } = useCompanyAuditTrail();
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const allEntries = useMemo(() => {
    if (!rawAudit) return REPORT_AUDIT_ENTRIES;
    return [...rawAudit, ...REPORT_AUDIT_ENTRIES].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [rawAudit]);

  const actors = useMemo(() => {
    const set = new Set(allEntries.map((e) => e.actor));
    return Array.from(set).sort();
  }, [allEntries]);

  const actions = useMemo(() => {
    const set = new Set(allEntries.map((e) => e.action));
    return Array.from(set).sort();
  }, [allEntries]);

  const entities = useMemo(() => {
    const set = new Set(allEntries.map((e) => e.entity));
    return Array.from(set).sort();
  }, [allEntries]);

  const filtered = useMemo(() => {
    return allEntries.filter((e) => {
      if (actorFilter !== "all" && e.actor !== actorFilter) return false;
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (entityFilter !== "all" && e.entity !== entityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${e.actor} ${e.action} ${e.entity} ${e.details} ${e.entityId}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [allEntries, actorFilter, actionFilter, entityFilter, searchQuery]);

  if (loading) return <LoadingState rows={8} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audit Trail"
        subtitle="Track all system and user actions"
        stage="reports"
        actions={
          <div className="flex items-center gap-2 text-[10px] text-white/50">
            <Activity className="h-3.5 w-3.5" />
            <span className="font-mono">{allEntries.length}</span> total entries
          </div>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/45" />
          <Input
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-white/[0.04] border-white/10 placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-white/45" />
          <Select value={actorFilter} onValueChange={setActorFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-white/[0.04] border-white/10">
              <User className="h-3 w-3 mr-1 text-white/45" />
              <SelectValue placeholder="Actor" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(0,0%,10%)] border-white/10">
              <SelectItem value="all" className="text-xs">All Actors</SelectItem>
              {actors.map((a) => (
                <SelectItem key={a} value={a} className="text-xs">
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs bg-white/[0.04] border-white/10">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(0,0%,10%)] border-white/10">
            <SelectItem value="all" className="text-xs">All Actions</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a} className="text-xs">
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[140px] h-8 text-xs bg-white/[0.04] border-white/10">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(0,0%,10%)] border-white/10">
            <SelectItem value="all" className="text-xs">All Entities</SelectItem>
            {entities.map((e) => (
              <SelectItem key={e} value={e} className="text-xs">
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-auto text-[10px] font-mono text-white/45">
          {filtered.length} / {allEntries.length} entries
        </span>
      </div>

      <div className="glass-card card-report overflow-hidden">
        <ScrollArea className="h-[560px]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[150px]">
                  Timestamp
                </TableHead>
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[120px]">
                  Actor
                </TableHead>
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[160px]">
                  Action
                </TableHead>
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[100px]">
                  Entity
                </TableHead>
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider">
                  Details
                </TableHead>
                <TableHead className="text-[10px] text-white/50 font-display uppercase tracking-wider w-[60px] text-right">
                  Version
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const ts = formatTimestamp(entry.timestamp);
                const actionStyle = ACTION_STYLES[entry.action] || DEFAULT_ACTION_STYLE;
                return (
                  <TableRow key={entry.id} className="border-white/[0.08] hover:bg-white/[0.08]">
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono text-white/60">{ts.date}</span>
                        <span className="block text-[10px] font-mono text-white/45">{ts.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            entry.actor === "System"
                              ? "bg-violet-500/20 text-violet-400"
                              : "bg-sky-500/20 text-sky-400"
                          }`}
                        >
                          {entry.actor === "System" ? "S" : entry.actor[0]}
                        </div>
                        <span className="text-xs text-white/70">{entry.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionStyle + " text-[9px] border"}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-white/50">
                      {entry.entity}
                    </TableCell>
                    <TableCell className="text-xs text-white/50">
                      {truncate(entry.details)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-white/5 text-white/50 border-white/10 text-[9px] border font-mono">
                        {entry.version}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <p className="text-sm text-white/45">No audit entries match the current filters.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

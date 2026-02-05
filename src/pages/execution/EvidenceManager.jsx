import React, { useMemo, useState } from "react";
import {
  FileText,
  FileCheck,
  FileClock,
  FileWarning,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Hash,
  Eye,
  Search,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import AgentHandoffButton from "@/components/AgentHandoffButton";
import AgentInsightCard from "@/components/AgentInsightCard";
import { usePageInsights, usePageHandoff } from "@/context/AgentContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompanyEvidenceDocuments } from "@/hooks/useCompanyData";

const TYPE_CONFIG = {
  Invoice: {
    color: "bg-[#2B5AEE]/20 text-[#2B5AEE] border-[#2B5AEE]/30",
    icon: FileText,
  },
  Certificate: {
    color: "bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30",
    icon: FileCheck,
  },
  Report: {
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: FileText,
  },
  Declaration: {
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: FileClock,
  },
};

const OCR_STATUS_CONFIG = {
  Complete: {
    color: "text-[#0FD68C]",
    bg: "bg-[#0FD68C]/20",
    icon: CheckCircle2,
    pct: 100,
  },
  Pending: {
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    icon: Clock,
    pct: 45,
  },
  Failed: {
    color: "text-red-400",
    bg: "bg-red-500/20",
    icon: FileWarning,
    pct: 0,
  },
};

function ConfidenceBar({ confidence }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 95
      ? "bg-[#0FD68C]"
      : pct >= 85
      ? "bg-[#0CC5D4]"
      : pct >= 70
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-white/50">{pct}%</span>
    </div>
  );
}

function DocumentCard({ doc }) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = TYPE_CONFIG[doc.type] || TYPE_CONFIG.Report;
  const ocrConfig = OCR_STATUS_CONFIG[doc.ocrStatus] || OCR_STATUS_CONFIG.Pending;
  const IconComp = typeConfig.icon;
  const OcrIcon = ocrConfig.icon;

  return (
    <div className="glass-card transition-all duration-200 hover:bg-white/[0.10]">
      {/* Main row */}
      <div
        className="p-4 cursor-pointer flex items-center gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color
            .split(" ")
            .find((c) => c.startsWith("bg-"))}`}
        >
          <IconComp className={`h-5 w-5 ${typeConfig.color.split(" ").find((c) => c.startsWith("text-"))}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">
            {doc.fileName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              className={`${typeConfig.color} text-[10px] border`}
            >
              {doc.type}
            </Badge>
            <span className="text-[10px] text-white/40">{doc.supplier}</span>
            <span className="text-[10px] font-mono text-white/40">
              {doc.uploadDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex items-center gap-1 text-xs ${ocrConfig.color}`}
          >
            <OcrIcon className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px]">{doc.ocrStatus}</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-white/40" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/40" />
          )}
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/[0.08] animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* OCR Status & Extracted Fields */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs font-display font-semibold text-white/70">
                  OCR Extraction
                </span>
                <div className="flex-1 ml-2">
                  <Progress
                    value={ocrConfig.pct}
                    className="h-1.5 bg-white/10"
                  />
                </div>
              </div>
              {doc.extractedFields.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.08]">
                      <TableHead className="text-white/40 text-[10px] h-8">
                        Field
                      </TableHead>
                      <TableHead className="text-white/40 text-[10px] h-8">
                        Extracted Value
                      </TableHead>
                      <TableHead className="text-white/40 text-[10px] h-8">
                        Confidence
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doc.extractedFields.map((f, i) => (
                      <TableRow key={i} className="border-white/[0.08]">
                        <TableCell className="text-xs text-white/60 py-2">
                          {f.field}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-white/90 py-2">
                          {f.value}
                        </TableCell>
                        <TableCell className="py-2">
                          <ConfidenceBar confidence={f.confidence} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-xs text-white/40 py-4 text-center glass-subtle rounded-lg">
                  No fields extracted. OCR may have failed for this document.
                </div>
              )}
            </div>

            {/* Provenance */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-3.5 w-3.5 text-white/40" />
                <span className="text-xs font-display font-semibold text-white/70">
                  Provenance & Audit Trail
                </span>
              </div>
              <div className="glass-subtle rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                    SHA-256 Hash
                  </span>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-white/40" />
                    <code className="text-[11px] font-mono text-[#0CC5D4] truncate">
                      {doc.provenance.hash}
                    </code>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                    Source
                  </span>
                  <p className="text-xs text-white/70">{doc.provenance.source}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                    Verified By
                  </span>
                  <p className="text-xs text-white/70">
                    {doc.provenance.verifiedBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvidenceManager() {
  const { data: documents, loading } = useCompanyEvidenceDocuments();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const insights = usePageInsights("evidence");
  const handoff = usePageHandoff("evidence");

  const stats = useMemo(() => {
    if (!documents)
      return { total: 0, complete: 0, pending: 0, verified: 0 };
    return {
      total: documents.length,
      complete: documents.filter((d) => d.ocrStatus === "Complete").length,
      pending: documents.filter(
        (d) => d.ocrStatus === "Pending" || d.ocrStatus === "Failed"
      ).length,
      verified: documents.filter(
        (d) =>
          d.provenance.verifiedBy !== "Pending" &&
          d.provenance.verifiedBy !== "N/A"
      ).length,
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    if (!documents) return [];
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.fileName.toLowerCase().includes(q) ||
        d.supplier.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Evidence Manager"
        subtitle="Audit-ready document management with OCR provenance"
        stage="execution"
        actions={
          <>
            <AgentHandoffButton handoff={handoff} />
            <Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 bg-[hsl(0,0%,6%)]">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Upload Evidence Document
                  </DialogTitle>
                  <DialogDescription>
                    Upload supporting documents for emissions data verification.
                    OCR will automatically extract relevant fields.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60">Document File</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#0FD68C]/30 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-white/40 mx-auto mb-2" />
                      <p className="text-sm text-white/50">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">
                        PDF, XLSX, CSV up to 25MB
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60">Supplier</Label>
                    <Input
                      placeholder="Select supplier..."
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/60">Document Type</Label>
                    <Input
                      placeholder="Invoice, Certificate, Report, Declaration"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    className="w-full bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black"
                    onClick={() => setUploadOpen(false)}
                  >
                    Upload & Process
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* --- Stats --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Documents"
          value={stats.total}
          icon={FileText}
          variant="default"
        />
        <MetricCard
          label="OCR Complete"
          value={stats.complete}
          icon={CheckCircle2}
          variant="primary"
          trend="up"
          trendValue={`${Math.round(
            (stats.complete / stats.total) * 100
          )}% processed`}
        />
        <MetricCard
          label="Pending Review"
          value={stats.pending}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          label="Verified"
          value={stats.verified}
          icon={ShieldCheck}
          variant="accent"
          trend="up"
          trendValue={`${Math.round(
            (stats.verified / stats.total) * 100
          )}% verified`}
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      {/* --- Search --- */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          placeholder="Search by filename, supplier, or type..."
          className="pl-10 bg-white/5 border-white/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* --- Document Cards --- */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
        {filteredDocs.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-sm text-white/65">
              No documents matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

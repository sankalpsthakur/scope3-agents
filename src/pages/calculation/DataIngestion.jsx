import React, { useMemo, useState, useCallback } from "react";
import {
  Database,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Layers,
  Wallet,
  BarChart3,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import LoadingState from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useCompanyProcurementData } from "@/hooks/useCompanyData";

// ---------------------------------------------------------------------------
// Category dot colors
// ---------------------------------------------------------------------------
const CATEGORY_COLORS = {
  Chemicals: "#10b981",
  "Steel & Metals": "#0ea5e9",
  Energy: "#f59e0b",
  Transport: "#8b5cf6",
  "Capital Goods": "#ec4899",
  "Waste Management": "#ef4444",
  Packaging: "#06b6d4",
};

function CategoryDot({ category }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2 shrink-0"
      style={{ backgroundColor: CATEGORY_COLORS[category] || "#64748b" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatEUR(amount) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DataIngestion() {
  const { data: rows, loading } = useCompanyProcurementData();

  // Filters
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  // Derived unique values for dropdowns
  const divisions = useMemo(() => {
    if (!rows) return [];
    return [...new Set(rows.map((r) => r.division))].sort();
  }, [rows]);

  const categories = useMemo(() => {
    if (!rows) return [];
    return [...new Set(rows.map((r) => r.category))].sort();
  }, [rows]);

  // Filtered + sorted data
  const filteredRows = useMemo(() => {
    if (!rows) return [];
    let result = [...rows];

    if (divisionFilter !== "all") {
      result = result.filter((r) => r.division === divisionFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.supplier.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount));
    return result;
  }, [rows, divisionFilter, categoryFilter, search, sortAsc]);

  // Stats
  const stats = useMemo(() => {
    if (!rows) return { total: 0, spend: 0, categories: 0, avgDq: 0 };
    const spend = rows.reduce((s, r) => s + r.amount, 0);
    const cats = new Set(rows.map((r) => r.category)).size;
    return { total: rows.length, spend, categories: cats, avgDq: 82 };
  }, [rows]);

  const toggleSort = useCallback(() => setSortAsc((p) => !p), []);

  if (loading) return <LoadingState rows={8} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Data Ingestion"
        subtitle="Procurement data imported for LCA quantification"
        stage="calculation"
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Rows"
          value={stats.total.toLocaleString()}
          icon={Database}
          variant="default"
        />
        <MetricCard
          label="Total Spend"
          value={formatEUR(stats.spend)}
          icon={Wallet}
          variant="primary"
        />
        <MetricCard
          label="Categories Covered"
          value={stats.categories}
          icon={Layers}
          variant="secondary"
        />
        <MetricCard
          label="Data Quality Avg"
          value={`${stats.avgDq}%`}
          icon={BarChart3}
          variant="accent"
          trend="up"
          trendValue="+3 pts"
        />
      </div>

      {/* Filter row */}
      <div className="glass-card card-calculate p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-[180px] bg-white/[0.08] border-white/10">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-white/[0.08] border-white/10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search suppliers, descriptions, countries..."
              className="pl-9 bg-white/[0.08] border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="glass-card card-calculate overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                Supplier
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                Category
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                Subcategory
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden xl:table-cell">
                Description
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider text-right">
                <button
                  onClick={toggleSort}
                  className="inline-flex items-center gap-1 hover:text-white/90 transition-colors"
                >
                  Amount (EUR)
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider text-right">
                Quantity
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider">
                Unit
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden lg:table-cell">
                Division
              </TableHead>
              <TableHead className="text-white/60 font-display uppercase text-[11px] tracking-wider hidden lg:table-cell">
                Country
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow
                key={row.id}
                className={`border-white/[0.12] transition-colors ${
                  idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.05]"
                } hover:bg-white/[0.10]`}
              >
                <TableCell className="font-medium text-white/90 text-sm">
                  {row.supplier}
                </TableCell>
                <TableCell className="text-sm text-white/70">
                  <span className="flex items-center">
                    <CategoryDot category={row.category} />
                    {row.category}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-white/60">
                  {row.subcategory}
                </TableCell>
                <TableCell className="text-sm text-white/50 max-w-[220px] truncate hidden xl:table-cell">
                  {row.description}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-white/90 tabular-nums">
                  {formatEUR(row.amount)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-white/70 tabular-nums">
                  {row.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-white/60">
                  {row.unit}
                </TableCell>
                <TableCell className="text-sm text-white/60 hidden lg:table-cell">
                  {row.division}
                </TableCell>
                <TableCell className="text-sm text-white/60 hidden lg:table-cell">
                  {row.country}
                </TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-white/50">
                  No procurement records match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Import status */}
      <div className="glass-card p-4 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-white/80">
            Last import: Jan 15, 2025
          </p>
          <p className="text-xs text-white/50">
            20 records imported from SAP S/4HANA -- Batch BATCH-2024-Q4
          </p>
        </div>
        <Badge className="ml-auto bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Synced
        </Badge>
      </div>
    </div>
  );
}

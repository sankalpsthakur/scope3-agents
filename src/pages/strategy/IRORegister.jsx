import React, { useMemo, useState, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ArrowUpDown,
  Plus,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MetricCard from '@/components/MetricCard';
import LoadingState from '@/components/LoadingState';
import AgentHandoffButton from '@/components/AgentHandoffButton';
import AgentInsightCard from '@/components/AgentInsightCard';
import { usePageInsights, usePageHandoff } from '@/context/AgentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useCompanyIRORegister } from '@/hooks/useCompanyData';

const IRO_TYPE_STYLES = {
  Impact: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Risk: 'bg-red-500/20 text-red-400 border-red-500/30',
  Opportunity: 'bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30',
};

const TOPIC_BADGE_STYLES = {
  E: 'bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30',
  S: 'bg-[#2B5AEE]/20 text-[#2B5AEE] border-[#2B5AEE]/30',
  G: 'bg-[#1BB892]/20 text-[#1BB892] border-[#1BB892]/30',
};

const TIME_HORIZON_STYLES = {
  'Short-term': 'bg-[#0CC5D4]/15 text-[#0CC5D4] border-[#0CC5D4]/25',
  'Medium-term': 'bg-[#2B5AEE]/15 text-[#2B5AEE] border-[#2B5AEE]/25',
  'Long-term': 'bg-[#9366E8]/15 text-[#9366E8] border-[#9366E8]/25',
};

const STATUS_STYLES = {
  Assessed: 'bg-[#0FD68C]/15 text-[#0FD68C] border-[#0FD68C]/25',
  'In Progress': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Not Started': 'bg-white/5 text-white/50 border-white/10',
};

function ScoreBar({ value, color }) {
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.10] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-white/60 w-7 text-right">{value}</span>
    </div>
  );
}

function SortableHeader({ label, sortKey, currentSort, onSort }) {
  const isActive = currentSort.key === sortKey;
  const isAsc = isActive && currentSort.direction === 'asc';

  return (
    <TableHead
      className="cursor-pointer select-none hover:text-white transition-colors group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown className={`h-3 w-3 transition-opacity ${isActive ? 'opacity-100 text-[#0FD68C]' : 'opacity-0 group-hover:opacity-50'}`} />
        {isActive && (
          isAsc
            ? <ChevronUp className="h-3 w-3 text-[#0FD68C]" />
            : <ChevronDown className="h-3 w-3 text-[#0FD68C]" />
        )}
      </div>
    </TableHead>
  );
}

export default function IRORegister() {
  const insights = usePageInsights("iro");
  const handoff = usePageHandoff("iro");
  const { data: iros, loading } = useCompanyIRORegister();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [sort, setSort] = useState({ key: null, direction: 'desc' });

  const handleSort = useCallback((key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const filtered = useMemo(() => {
    if (!iros) return [];
    let result = [...iros];

    if (filter === 'Impacts') result = result.filter((i) => i.iroType === 'Impact');
    else if (filter === 'Risks') result = result.filter((i) => i.iroType === 'Risk');
    else if (filter === 'Opportunities') result = result.filter((i) => i.iroType === 'Opportunity');

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.topicName.toLowerCase().includes(q) ||
          i.topicCode.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    if (sort.key) {
      result.sort((a, b) => {
        let aVal = a[sort.key];
        let bVal = b[sort.key];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [iros, filter, search, sort]);

  const metrics = useMemo(() => {
    if (!iros) return { total: 0, impacts: 0, risks: 0, opportunities: 0 };
    return {
      total: iros.length,
      impacts: iros.filter((i) => i.iroType === 'Impact').length,
      risks: iros.filter((i) => i.iroType === 'Risk').length,
      opportunities: iros.filter((i) => i.iroType === 'Opportunity').length,
    };
  }, [iros]);

  if (loading) return <LoadingState rows={8} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="IRO Register"
        subtitle="Track impacts, risks & opportunities across ESRS topics"
        stage="strategy"
        actions={<><AgentHandoffButton handoff={handoff} /><Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2"><Plus className="h-3.5 w-3.5" />Add IRO</Button></>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total IROs"
          value={metrics.total}
          icon={ClipboardList}
          variant="default"
        />
        <MetricCard
          label="Impacts"
          value={metrics.impacts}
          variant="accent"
          trend="neutral"
        />
        <MetricCard
          label="Risks"
          value={metrics.risks}
          variant="destructive"
          trend="neutral"
        />
        <MetricCard
          label="Opportunities"
          value={metrics.opportunities}
          variant="primary"
          trend="neutral"
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      <div className="glass-card card-strategy p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-auto">
            <TabsList className="bg-white/[0.04] border border-white/[0.08]">
              <TabsTrigger value="All" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="Impacts" className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Impacts</TabsTrigger>
              <TabsTrigger value="Risks" className="text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">Risks</TabsTrigger>
              <TabsTrigger value="Opportunities" className="text-xs data-[state=active]:bg-[#0FD68C]/20 data-[state=active]:text-[#0FD68C]">Opportunities</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/45" />
            <Input
              placeholder="Search IROs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-white/[0.03] border-white/[0.08] focus:border-[#0FD68C]/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="w-8" />
                <SortableHeader label="Topic" sortKey="topicCode" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Topic Name" sortKey="topicName" currentSort={sort} onSort={handleSort} />
                <TableHead>IRO Type</TableHead>
                <SortableHeader label="Title" sortKey="title" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Impact Score" sortKey="impactMateriality" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Financial Score" sortKey="financialMateriality" currentSort={sort} onSort={handleSort} />
                <TableHead>Material?</TableHead>
                <TableHead>Time Horizon</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((iro) => {
                const catKey = iro.topicCode[0];
                const isExpanded = expandedId === iro.id;
                return (
                  <React.Fragment key={iro.id}>
                    <TableRow
                      className="border-white/[0.08] cursor-pointer hover:bg-white/[0.08] transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : iro.id)}
                    >
                      <TableCell className="w-8 pr-0">
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-white/45 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge className={TOPIC_BADGE_STYLES[catKey] + ' text-[10px] font-mono border'}>
                          {iro.topicCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-white/70">{iro.topicName}</TableCell>
                      <TableCell>
                        <Badge className={IRO_TYPE_STYLES[iro.iroType] + ' text-[10px] border'}>
                          {iro.iroType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-white/80 max-w-[200px] truncate">
                        {iro.title}
                      </TableCell>
                      <TableCell>
                        <ScoreBar value={iro.impactMateriality} color="bg-[#0FD68C]" />
                      </TableCell>
                      <TableCell>
                        <ScoreBar value={iro.financialMateriality} color="bg-[#2B5AEE]" />
                      </TableCell>
                      <TableCell>
                        {iro.isMaterial ? (
                          <div className="flex items-center gap-1">
                            <Check className="h-3.5 w-3.5 text-[#0FD68C]" />
                            <span className="text-[10px] text-[#0FD68C]">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <X className="h-3.5 w-3.5 text-white/25" />
                            <span className="text-[10px] text-white/25">No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={TIME_HORIZON_STYLES[iro.timeHorizon] + ' text-[10px] border'}>
                          {iro.timeHorizon}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_STYLES[iro.status] + ' text-[10px] border'}>
                          {iro.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="border-white/[0.08] bg-white/[0.05]">
                        <TableCell colSpan={10} className="py-3 px-8">
                          <div className="animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-display uppercase tracking-widest text-white/50">
                                Description
                              </span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
                              {iro.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.08]">
                              <div className="text-[10px]">
                                <span className="text-white/50">IRO ID: </span>
                                <span className="font-mono text-white/60">{iro.id}</span>
                              </div>
                              <div className="text-[10px]">
                                <span className="text-white/50">Combined Score: </span>
                                <span className="font-mono font-bold text-[#0CC5D4]">
                                  {iro.impactMateriality + iro.financialMateriality}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-sm text-white/50">
                    No IROs match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.08]">
          <span className="text-[10px] text-white/50 font-mono">
            Showing {filtered.length} of {iros?.length || 0} IROs
          </span>
        </div>
      </div>
    </div>
  );
}

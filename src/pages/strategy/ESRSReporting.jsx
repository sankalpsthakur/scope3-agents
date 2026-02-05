import React, { useMemo, useState } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Code,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MetricCard from '@/components/MetricCard';
import LoadingState from '@/components/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCompanyESRSKPIs } from '@/hooks/useCompanyData';

const STANDARD_LABELS = {
  E1: { name: 'Climate Change', category: 'Environmental' },
  E2: { name: 'Pollution', category: 'Environmental' },
  E3: { name: 'Water & Marine Resources', category: 'Environmental' },
  E4: { name: 'Biodiversity & Ecosystems', category: 'Environmental' },
  E5: { name: 'Circular Economy', category: 'Environmental' },
  S1: { name: 'Own Workforce', category: 'Social' },
  S2: { name: 'Workers in Value Chain', category: 'Social' },
  S3: { name: 'Affected Communities', category: 'Social' },
  S4: { name: 'Consumers & End-users', category: 'Social' },
  G1: { name: 'Business Conduct', category: 'Governance' },
};

const STANDARD_BADGE_STYLES = {
  E: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  S: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  G: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const CONFIDENCE_STYLES = {
  High: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Low: 'bg-red-500/15 text-red-400 border-red-500/25',
};

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-sky-400" />;
  return <Minus className="h-4 w-4 text-white/50" />;
}

function formatValue(value) {
  if (typeof value === 'number') {
    if (value >= 10000) {
      return value.toLocaleString('en-US');
    }
    if (Number.isInteger(value)) {
      return value.toLocaleString('en-US');
    }
    return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  return value;
}

function progressToTarget(value, target) {
  if (!target || target === 0) return 100;
  return Math.min(100, Math.round((value / target) * 100));
}

function KPICard({ kpi, index }) {
  const catKey = kpi.standard[0];
  const badgeStyle = STANDARD_BADGE_STYLES[catKey];
  const confStyle = CONFIDENCE_STYLES[kpi.confidence] || CONFIDENCE_STYLES.Medium;
  const standardInfo = STANDARD_LABELS[kpi.standard];
  const progress = progressToTarget(kpi.value, kpi.target);
  const isOnTrack = progress >= 80;
  const trendDesirable = (kpi.trend === 'down' && kpi.value > kpi.target) || (kpi.trend === 'up' && kpi.value < kpi.target) || kpi.trend === 'stable';

  return (
    <div
      className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-300 group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={badgeStyle + ' text-[10px] font-mono font-bold border'}>
            {kpi.standard}
          </Badge>
          {standardInfo && (
            <span className="text-[10px] text-white/50">{standardInfo.name}</span>
          )}
        </div>
        <Badge className={confStyle + ' text-[9px] border'}>
          {kpi.confidence}
        </Badge>
      </div>

      <p className="text-sm font-medium text-white/80 mb-4 leading-snug">{kpi.metric}</p>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-mono font-bold text-white tracking-tight">
          {formatValue(kpi.value)}
        </span>
        <span className="text-sm font-mono text-white/65">{kpi.unit}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/50">
            Target: <span className="font-mono text-white/50">{formatValue(kpi.target)} {kpi.unit}</span>
          </span>
          <span className={`text-[10px] font-mono font-bold ${isOnTrack ? 'text-emerald-400' : 'text-amber-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.10] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOnTrack
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                : progress >= 50
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-1.5">
          <TrendIcon trend={kpi.trend} />
          <span className={`text-xs ${trendDesirable ? 'text-emerald-400' : 'text-amber-400'}`}>
            {kpi.trend === 'up' ? 'Increasing' : kpi.trend === 'down' ? 'Decreasing' : 'Stable'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/50">
          Baseline {kpi.baselineYear}
        </span>
      </div>
    </div>
  );
}

export default function ESRSReporting() {
  const { data: kpis, loading } = useCompanyESRSKPIs();
  const [activeTab, setActiveTab] = useState('Environmental');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('pdf');

  const grouped = useMemo(() => {
    if (!kpis) return { Environmental: [], Social: [], Governance: [] };
    const groups = { Environmental: [], Social: [], Governance: [] };
    kpis.forEach((kpi) => {
      const info = STANDARD_LABELS[kpi.standard];
      if (info) {
        groups[info.category].push(kpi);
      }
    });
    return groups;
  }, [kpis]);

  const metrics = useMemo(() => {
    if (!kpis) return { total: 0, onTrack: 0, highConf: 0, standards: 0 };
    const onTrack = kpis.filter((k) => progressToTarget(k.value, k.target) >= 80).length;
    const highConf = kpis.filter((k) => k.confidence === 'High').length;
    const standards = new Set(kpis.map((k) => k.standard)).size;
    return { total: kpis.length, onTrack, highConf, standards };
  }, [kpis]);

  const handleExport = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="ESRS Reporting"
        subtitle="European Sustainability Reporting Standards KPI dashboard"
        stage="strategy"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-white/10 hover:bg-white/5 gap-1.5"
              onClick={() => handleExport('pdf')}
            >
              <Download className="h-3.5 w-3.5" />
              Generate ESRS Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-white/10 hover:bg-white/5 gap-1.5"
              onClick={() => handleExport('xbrl')}
            >
              <Code className="h-3.5 w-3.5" />
              Export iXBRL
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total KPIs"
          value={metrics.total}
          icon={FileText}
          variant="default"
        />
        <MetricCard
          label="On Track"
          value={metrics.onTrack}
          unit={`/ ${metrics.total}`}
          icon={CheckCircle2}
          variant="primary"
          trend="up"
          trendValue={`${((metrics.onTrack / metrics.total) * 100).toFixed(0)}%`}
        />
        <MetricCard
          label="High Confidence"
          value={metrics.highConf}
          unit="KPIs"
          icon={TrendingUp}
          variant="secondary"
        />
        <MetricCard
          label="ESRS Standards"
          value={metrics.standards}
          unit="covered"
          icon={AlertCircle}
          variant="accent"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.04] border border-white/[0.08]">
          <TabsTrigger
            value="Environmental"
            className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Environmental
            <Badge className="bg-white/5 text-white/50 border-white/10 text-[9px] border ml-1">
              {grouped.Environmental.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="Social"
            className="text-xs data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400 gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Social
            <Badge className="bg-white/5 text-white/50 border-white/10 text-[9px] border ml-1">
              {grouped.Social.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="Governance"
            className="text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Governance
            <Badge className="bg-white/5 text-white/50 border-white/10 text-[9px] border ml-1">
              {grouped.Governance.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['Environmental', 'Social', 'Governance'].map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped[cat].map((kpi, idx) => (
                <KPICard key={kpi.id} kpi={kpi} index={idx} />
              ))}
            </div>
            {grouped[cat].length === 0 && (
              <div className="glass-card p-12 text-center">
                <p className="text-sm text-white/50">No KPIs found for this category.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-white/10 bg-[hsl(0,0%,7%)]">
          <DialogHeader>
            <DialogTitle className="font-display">
              {dialogType === 'pdf' ? 'ESRS Report Generation' : 'iXBRL Export'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'pdf'
                ? 'Your CSRD-compliant ESRS sustainability report is being prepared. In a production environment, this would generate a formatted PDF document containing all disclosed KPIs, targets, and narrative descriptions.'
                : 'The inline XBRL export is being prepared. In a production environment, this would generate an iXBRL-tagged document ready for digital filing with the European Single Access Point (ESAP).'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Demo Mode</p>
              <p className="text-xs text-white/65 mt-0.5">
                This is a demonstration. {metrics.total} KPIs across {metrics.standards} ESRS standards are ready for export.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

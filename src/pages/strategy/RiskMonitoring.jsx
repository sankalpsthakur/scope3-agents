import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  AlertTriangle,
  Scale,
  CloudRain,
  TrendingUp,
  Eye,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Activity,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MetricCard from '@/components/MetricCard';
import LoadingState from '@/components/LoadingState';
import { Badge } from '@/components/ui/badge';
import { useCompanyRiskSignals } from '@/hooks/useCompanyData';

const CATEGORY_CONFIG = {
  Regulatory: {
    icon: Scale,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/15',
    borderColor: 'border-sky-500/25',
    chartColor: '#38bdf8',
  },
  Physical: {
    icon: CloudRain,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/25',
    chartColor: '#34d399',
  },
  Transition: {
    icon: TrendingUp,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/25',
    chartColor: '#fbbf24',
  },
  Reputational: {
    icon: Eye,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/15',
    borderColor: 'border-violet-500/25',
    chartColor: '#a78bfa',
  },
};

const RELEVANCE_STYLES = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Low: 'bg-white/10 text-white/50 border-white/10',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="glass-card p-2.5 border border-white/10 shadow-xl min-w-[120px]">
      <p className="text-xs font-medium text-white">{d.name}</p>
      <p className="text-lg font-mono font-bold text-white mt-0.5">
        {d.value}
        <span className="text-xs text-white/50 ml-1">signals</span>
      </p>
    </div>
  );
}

function RiskSignalCard({ signal, index }) {
  const catCfg = CATEGORY_CONFIG[signal.category] || CATEGORY_CONFIG.Regulatory;
  const CatIcon = catCfg.icon;
  const relStyle = RELEVANCE_STYLES[signal.relevance] || RELEVANCE_STYLES.Medium;

  return (
    <div
      className="glass-card p-5 hover:bg-white/[0.10] transition-all duration-300 group animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${catCfg.bgColor} ${catCfg.borderColor} border shrink-0`}
        >
          <CatIcon className={`h-5 w-5 ${catCfg.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge className={`${catCfg.bgColor} ${catCfg.color} ${catCfg.borderColor} text-[10px] border`}>
              {signal.category}
            </Badge>
            <Badge className={relStyle + ' text-[10px] border'}>
              {signal.relevance} Relevance
            </Badge>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-white/30 shrink-0">
              <Calendar className="h-3 w-3" />
              {formatDate(signal.date)}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
            {signal.title}
          </h4>

          <p className="text-xs text-white/65 leading-relaxed mb-3">
            {signal.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-white/50 font-display uppercase tracking-widest shrink-0">
              Source:
            </span>
            <Badge className="bg-white/5 text-white/50 border-white/10 text-[10px] border gap-1">
              <ExternalLink className="h-2.5 w-2.5" />
              {signal.source}
            </Badge>

            {signal.linkedIROs.length > 0 && (
              <>
                <span className="text-[10px] text-white/50 font-display uppercase tracking-widest shrink-0 ml-2">
                  Linked IROs:
                </span>
                {signal.linkedIROs.map((iro) => (
                  <Badge
                    key={iro}
                    className="bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20 text-[10px] font-mono border"
                  >
                    {iro}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RiskMonitoring() {
  const { data: signals, loading } = useCompanyRiskSignals();

  const metrics = useMemo(() => {
    if (!signals) return { total: 0, high: 0, regulatory: 0, recent: 0 };
    const high = signals.filter((s) => s.relevance === 'High').length;
    const regulatory = signals.filter((s) => s.category === 'Regulatory').length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recent = signals.filter((s) => new Date(s.date) >= thirtyDaysAgo).length;
    return { total: signals.length, high, regulatory, recent };
  }, [signals]);

  const categoryBreakdown = useMemo(() => {
    if (!signals) return [];
    const counts = {};
    signals.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_CONFIG[name]?.chartColor || '#666',
    }));
  }, [signals]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Monitoring"
        subtitle="External risk signals & regulatory tracking"
        stage="strategy"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Risk Signals"
          value={metrics.total}
          icon={AlertTriangle}
          variant="default"
        />
        <MetricCard
          label="High Relevance"
          value={metrics.high}
          icon={ShieldAlert}
          variant="destructive"
          trend="neutral"
          trendValue={`${((metrics.high / metrics.total) * 100).toFixed(0)}% of total`}
        />
        <MetricCard
          label="Regulatory Signals"
          value={metrics.regulatory}
          icon={Scale}
          variant="secondary"
        />
        <MetricCard
          label="Last 30 Days"
          value={metrics.recent}
          unit="new"
          icon={Activity}
          variant="primary"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="space-y-3">
          {signals.map((signal, idx) => (
            <RiskSignalCard key={signal.id} signal={signal} index={idx} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="glass-card card-strategy p-5 sticky top-24">
            <h3 className="text-sm font-display font-semibold text-white mb-4">
              Risk Category Breakdown
            </h3>

            <div className="flex justify-center" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="transparent"
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {categoryBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-3">
              {categoryBreakdown.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat.name];
                const CatIcon = cfg?.icon || AlertTriangle;
                return (
                  <div key={cat.name} className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <CatIcon className={`h-3.5 w-3.5 ${cfg?.color || 'text-white/50'}`} />
                    <span className="text-xs text-white/70 flex-1">{cat.name}</span>
                    <span className="text-xs font-mono font-bold text-white/90">{cat.value}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              <h4 className="text-[10px] font-display uppercase tracking-widest text-white/50 mb-3">
                Relevance Distribution
              </h4>
              {['High', 'Medium', 'Low'].map((level) => {
                const count = signals.filter((s) => s.relevance === level).length;
                const pct = ((count / signals.length) * 100).toFixed(0);
                const relCfg = RELEVANCE_STYLES[level];
                return (
                  <div key={level} className="flex items-center gap-2 mb-2">
                    <Badge className={relCfg + ' text-[10px] border w-16 justify-center'}>
                      {level}
                    </Badge>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.10] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          level === 'High'
                            ? 'bg-red-500'
                            : level === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-white/20'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/60 w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

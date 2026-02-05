import React, { useMemo } from 'react';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Calendar,
  Mail,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MetricCard from '@/components/MetricCard';
import LoadingState from '@/components/LoadingState';
import AgentHandoffButton from '@/components/AgentHandoffButton';
import AgentInsightCard from '@/components/AgentInsightCard';
import { usePageInsights, usePageHandoff } from '@/context/AgentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompanyStakeholders } from '@/hooks/useCompanyData';

const TYPE_STYLES = {
  Regulator: 'bg-red-500/20 text-red-400 border-red-500/30',
  Investor: 'bg-[#0FD68C]/20 text-[#0FD68C] border-[#0FD68C]/30',
  'Employee Rep': 'bg-[#2B5AEE]/20 text-[#2B5AEE] border-[#2B5AEE]/30',
  NGO: 'bg-[#1BB892]/20 text-[#1BB892] border-[#1BB892]/30',
  Supplier: 'bg-[#9366E8]/20 text-[#9366E8] border-[#9366E8]/30',
  'Rating Agency': 'bg-[#0CC5D4]/20 text-[#0CC5D4] border-[#0CC5D4]/30',
  Community: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Customer: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const SENTIMENT_CONFIG = {
  Positive: { dot: 'bg-[#0FD68C] shadow-[0_0_6px_rgba(15,214,140,0.5)]', label: 'text-[#0FD68C]' },
  Neutral: { dot: 'bg-[#2B5AEE] shadow-[0_0_6px_rgba(43,90,238,0.5)]', label: 'text-[#2B5AEE]' },
  Critical: { dot: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]', label: 'text-red-400' },
  Concerned: { dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]', label: 'text-amber-400' },
};

function getInitials(name) {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getAvatarGradient(name) {
  const gradients = [
    'from-emerald-600 to-cyan-600',
    'from-sky-600 to-blue-600',
    'from-violet-600 to-purple-600',
    'from-amber-600 to-orange-600',
    'from-pink-600 to-rose-600',
    'from-cyan-600 to-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  if (days < 60) return '1 month ago';
  return `${Math.floor(days / 30)} months ago`;
}

function StakeholderCard({ stakeholder, index }) {
  const sentimentCfg = SENTIMENT_CONFIG[stakeholder.sentiment] || SENTIMENT_CONFIG.Neutral;
  const typeStyle = TYPE_STYLES[stakeholder.type] || 'bg-white/10 text-white/60 border-white/10';
  const gradient = getAvatarGradient(stakeholder.name);

  return (
    <div
      className="glass-card p-4 hover:bg-white/[0.10] transition-all duration-300 group animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white text-xs font-bold shrink-0 shadow-lg`}
        >
          {getInitials(stakeholder.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#0FD68C] transition-colors">
            {stakeholder.name}
          </h4>
          <p className="text-[11px] text-white/65 truncate">{stakeholder.role}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${sentimentCfg.dot}`} />
          <span className={`text-[10px] font-medium ${sentimentCfg.label}`}>
            {stakeholder.sentiment}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={typeStyle + ' text-[10px] border'}>{stakeholder.type}</Badge>
        <Badge className="bg-white/5 text-white/50 border-white/10 text-[10px] border">
          <Mail className="h-2.5 w-2.5 mr-1" />
          {stakeholder.engagementMethod}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {stakeholder.keyTopics.map((topic) => (
          <span
            key={topic}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/[0.08] text-white/60 border border-white/[0.12]"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-white/50 pt-2 border-t border-white/[0.08]">
        <Calendar className="h-3 w-3" />
        <span>Last engaged: </span>
        <span className="font-mono text-white/60">{daysSince(stakeholder.lastEngaged)}</span>
        <span className="ml-auto font-mono text-white/50">{stakeholder.lastEngaged}</span>
      </div>
    </div>
  );
}

export default function StakeholderEngagement() {
  const insights = usePageInsights("stakeholders");
  const handoff = usePageHandoff("stakeholders");
  const { data: stakeholders, loading } = useCompanyStakeholders();

  const metrics = useMemo(() => {
    if (!stakeholders) return { total: 0, engaged: 0, avgSentiment: 0, pending: 0 };

    const sentimentScore = { Positive: 1, Neutral: 0.5, Concerned: 0.25, Critical: 0 };
    const scores = stakeholders.map((s) => sentimentScore[s.sentiment] ?? 0.5);
    const avgSentiment = scores.reduce((a, b) => a + b, 0) / scores.length;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const engaged = stakeholders.filter((s) => new Date(s.lastEngaged) >= thirtyDaysAgo).length;

    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const pending = stakeholders.filter((s) => new Date(s.lastEngaged) < sixtyDaysAgo).length;

    return {
      total: stakeholders.length,
      engaged,
      avgSentiment: (avgSentiment * 100).toFixed(0),
      pending,
    };
  }, [stakeholders]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Stakeholder Engagement"
        subtitle="ESRS stakeholder mapping & engagement tracking"
        stage="strategy"
        actions={<><AgentHandoffButton handoff={handoff} /><Button size="sm" className="bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium gap-2"><Users className="h-3.5 w-3.5" />Add Stakeholder</Button></>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Stakeholders"
          value={metrics.total}
          icon={Users}
          variant="default"
        />
        <MetricCard
          label="Engaged (30d)"
          value={metrics.engaged}
          unit={`/ ${metrics.total}`}
          icon={MessageSquare}
          variant="primary"
          trend="up"
          trendValue={`${((metrics.engaged / metrics.total) * 100).toFixed(0)}%`}
        />
        <MetricCard
          label="Avg Sentiment"
          value={metrics.avgSentiment}
          unit="%"
          icon={TrendingUp}
          variant="secondary"
          trend={Number(metrics.avgSentiment) >= 50 ? 'up' : 'down'}
          trendValue={Number(metrics.avgSentiment) >= 50 ? 'Favorable' : 'At risk'}
        />
        <MetricCard
          label="Pending Follow-ups"
          value={metrics.pending}
          icon={Clock}
          variant={metrics.pending > 0 ? 'warning' : 'primary'}
          trend={metrics.pending > 0 ? 'down' : 'neutral'}
          trendValue={metrics.pending > 0 ? 'Overdue 60d+' : 'All current'}
        />
      </div>

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((i) => (
            <AgentInsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stakeholders.map((stakeholder, idx) => (
          <StakeholderCard key={stakeholder.id} stakeholder={stakeholder} index={idx} />
        ))}
      </div>
    </div>
  );
}

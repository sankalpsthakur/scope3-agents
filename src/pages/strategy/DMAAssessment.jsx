import React, { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Label,
} from 'recharts';
import { Target, CheckCircle2, BarChart3, TrendingUp, Info } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MetricCard from '@/components/MetricCard';
import LoadingState from '@/components/LoadingState';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCompanyIRORegister } from '@/hooks/useCompanyData';

const TOPIC_COLORS = {
  E1: '#34d399', E2: '#34d399', E3: '#34d399', E4: '#34d399', E5: '#34d399',
  S1: '#38bdf8', S2: '#38bdf8', S3: '#38bdf8', S4: '#38bdf8',
  G1: '#fbbf24',
};

const TOPIC_CATEGORY_LABELS = {
  E: { label: 'Environmental', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  S: { label: 'Social', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  G: { label: 'Governance', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

const IRO_TYPE_STYLES = {
  Impact: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Risk: 'bg-red-500/20 text-red-400 border-red-500/30',
  Opportunity: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

function CustomTooltipContent({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 min-w-[220px] shadow-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={IRO_TYPE_STYLES[d.iroType] + ' text-[10px] border'}>{d.iroType}</Badge>
        <Badge className={TOPIC_CATEGORY_LABELS[d.topicCode[0]]?.color + ' text-[10px] border'}>{d.topicCode}</Badge>
      </div>
      <p className="text-sm font-semibold text-white mb-1">{d.title}</p>
      <p className="text-xs text-white/60 mb-2">{d.topicName}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-white/65">Impact Score</span>
          <p className="font-mono font-bold text-emerald-400">{d.impactMateriality}</p>
        </div>
        <div>
          <span className="text-white/50">Financial Score</span>
          <p className="font-mono font-bold text-sky-400">{d.financialMateriality}</p>
        </div>
      </div>
    </div>
  );
}

function QuadrantLabel({ viewBox, text, position }) {
  const offsets = {
    topLeft: { dx: 20, dy: 20 },
    topRight: { dx: -20, dy: 20 },
    bottomLeft: { dx: 20, dy: -20 },
    bottomRight: { dx: -20, dy: -20 },
  };
  const o = offsets[position] || { dx: 0, dy: 0 };
  const anchor = position.includes('Right') ? 'end' : 'start';

  return (
    <text
      x={(viewBox.x || 0) + o.dx}
      y={(viewBox.y || 0) + o.dy}
      fill="rgba(255,255,255,0.12)"
      fontSize={13}
      fontFamily="Barlow Condensed, sans-serif"
      fontWeight={600}
      textAnchor={anchor}
      letterSpacing="0.05em"
    >
      {text.toUpperCase()}
    </text>
  );
}

export default function DMAAssessment() {
  const { data: iros, loading } = useCompanyIRORegister();
  const [hoveredId, setHoveredId] = useState(null);

  const scatterData = useMemo(() => {
    if (!iros) return [];
    return iros.map((iro) => ({
      ...iro,
      x: iro.financialMateriality,
      y: iro.impactMateriality,
      size: Math.max(40, ((iro.impactMateriality + iro.financialMateriality) / 200) * 200),
    }));
  }, [iros]);

  const metrics = useMemo(() => {
    if (!iros) return { total: 0, material: 0, avgImpact: 0, avgFinancial: 0 };
    const material = iros.filter((i) => i.isMaterial);
    const avgImpact = iros.reduce((s, i) => s + i.impactMateriality, 0) / iros.length;
    const avgFinancial = iros.reduce((s, i) => s + i.financialMateriality, 0) / iros.length;
    return {
      total: iros.length,
      material: material.length,
      avgImpact: avgImpact.toFixed(1),
      avgFinancial: avgFinancial.toFixed(1),
    };
  }, [iros]);

  const materialTopics = useMemo(() => {
    if (!iros) return [];
    return iros.filter((i) => i.isMaterial).sort((a, b) => {
      const scoreA = a.impactMateriality + a.financialMateriality;
      const scoreB = b.impactMateriality + b.financialMateriality;
      return scoreB - scoreA;
    });
  }, [iros]);

  if (loading) return <LoadingState rows={6} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Double Materiality Assessment"
        subtitle="CSRD-compliant impact & financial materiality matrix"
        stage="strategy"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total IROs Assessed"
          value={metrics.total}
          icon={Target}
          variant="default"
        />
        <MetricCard
          label="Material Topics"
          value={metrics.material}
          icon={CheckCircle2}
          variant="primary"
          trend="up"
          trendValue={`${((metrics.material / metrics.total) * 100).toFixed(0)}% rate`}
        />
        <MetricCard
          label="Avg Impact Score"
          value={metrics.avgImpact}
          unit="/100"
          icon={BarChart3}
          variant="secondary"
        />
        <MetricCard
          label="Avg Financial Score"
          value={metrics.avgFinancial}
          unit="/100"
          icon={TrendingUp}
          variant="accent"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        <div className="glass-card card-strategy p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-display font-semibold text-white">
                Materiality Matrix
              </h3>
              <p className="text-xs text-white/65 mt-0.5">
                Each dot represents an IRO. Size indicates combined materiality score.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Environmental
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Social
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Governance
              </div>
            </div>
          </div>
          <div className="w-full" style={{ height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 100]}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                >
                  <Label
                    value="Financial Materiality"
                    position="bottom"
                    offset={10}
                    style={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Barlow Condensed' }}
                  />
                </XAxis>
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 100]}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                >
                  <Label
                    value="Impact Materiality"
                    angle={-90}
                    position="insideLeft"
                    offset={-5}
                    style={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Barlow Condensed' }}
                  />
                </YAxis>
                <ReferenceLine
                  x={50}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="6 4"
                />
                <ReferenceLine
                  y={50}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="6 4"
                />
                <ReferenceLine x={0} y={100} stroke="transparent">
                  <Label content={<QuadrantLabel text="Impact Priority" position="topLeft" />} />
                </ReferenceLine>
                <ReferenceLine x={100} y={100} stroke="transparent">
                  <Label content={<QuadrantLabel text="Double Material" position="topRight" />} />
                </ReferenceLine>
                <ReferenceLine x={0} y={0} stroke="transparent">
                  <Label content={<QuadrantLabel text="Monitor" position="bottomLeft" />} />
                </ReferenceLine>
                <ReferenceLine x={100} y={0} stroke="transparent">
                  <Label content={<QuadrantLabel text="Financial Priority" position="bottomRight" />} />
                </ReferenceLine>
                <RechartsTooltip
                  content={<CustomTooltipContent />}
                  cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeDasharray: '4 4' }}
                />
                <Scatter data={scatterData} isAnimationActive>
                  {scatterData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={TOPIC_COLORS[entry.topicCode] || '#34d399'}
                      fillOpacity={hoveredId === entry.id ? 1 : 0.7}
                      stroke={hoveredId === entry.id ? '#fff' : 'transparent'}
                      strokeWidth={hoveredId === entry.id ? 2 : 0}
                      r={Math.max(6, entry.size / 20)}
                      onMouseEnter={() => setHoveredId(entry.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card card-strategy p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-display font-semibold text-white">
              Material Topics
            </h3>
            <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] border">
              {materialTopics.length}
            </Badge>
          </div>
          <ScrollArea className="flex-1 -mx-1 pr-1" style={{ maxHeight: 520 }}>
            <div className="space-y-2 px-1">
              {materialTopics.map((iro, idx) => {
                const catKey = iro.topicCode[0];
                const catConfig = TOPIC_CATEGORY_LABELS[catKey];
                return (
                  <div
                    key={iro.id}
                    className="group glass-subtle rounded-lg p-3 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
                    style={{ animationDelay: `${idx * 40}ms` }}
                    onMouseEnter={() => setHoveredId(iro.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      <Badge className={catConfig?.color + ' text-[10px] border shrink-0'}>
                        {iro.topicCode}
                      </Badge>
                      <Badge className={IRO_TYPE_STYLES[iro.iroType] + ' text-[10px] border shrink-0'}>
                        {iro.iroType}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-white/90 leading-snug mb-2">
                      {iro.title}
                    </p>
                    <div className="flex items-center gap-3 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="text-white/65">IMP</span>
                        <span className="font-mono font-bold text-emerald-400">{iro.impactMateriality}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-white/65">FIN</span>
                        <span className="font-mono font-bold text-sky-400">{iro.financialMateriality}</span>
                      </div>
                      <Badge className="ml-auto bg-white/10 text-white/50 border-white/10 text-[9px] border">
                        {iro.timeHorizon}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

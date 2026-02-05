import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const VARIANT_STYLES = {
  default: "border-white/[0.12]",
  primary: "border-emerald-500/35 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]",
  secondary: "border-sky-500/35 hover:shadow-[0_0_20px_rgba(14,165,233,0.12)]",
  accent: "border-cyan-500/35 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]",
  warning: "border-amber-500/35 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]",
  destructive: "border-red-500/35 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)]",
};

const VARIANT_TOP_BORDER = {
  default: "",
  primary: "border-t-2 border-t-emerald-500/60",
  secondary: "border-t-2 border-t-sky-500/60",
  accent: "border-t-2 border-t-cyan-500/60",
  warning: "border-t-2 border-t-amber-500/60",
  destructive: "border-t-2 border-t-red-500/60",
};

const VARIANT_ICON_BG = {
  default: "bg-white/15 text-white/70",
  primary: "bg-emerald-500/25 text-emerald-400",
  secondary: "bg-sky-500/25 text-sky-400",
  accent: "bg-cyan-500/25 text-cyan-400",
  warning: "bg-amber-500/25 text-amber-400",
  destructive: "bg-red-500/25 text-red-400",
};

function TrendIndicator({ trend, trendValue }) {
  if (!trend || trend === "neutral") {
    return (
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Minus className="h-3 w-3" />
        {trendValue && <span className="font-mono">{trendValue}</span>}
      </div>
    );
  }

  const isUp = trend === "up";

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs",
        isUp ? "text-emerald-400" : "text-red-400"
      )}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {trendValue && <span className="font-mono">{trendValue}</span>}
    </div>
  );
}

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  variant = "default",
}) {
  return (
    <div
      className={cn(
        "glass-card p-4 space-y-3 transition-all duration-200 hover:bg-white/[0.10]",
        VARIANT_STYLES[variant],
        VARIANT_TOP_BORDER[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/65 truncate">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              VARIANT_ICON_BG[variant]
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-mono font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono text-white/60">
            {unit}
          </span>
        )}
      </div>

      {(trend || trendValue) && (
        <TrendIndicator trend={trend} trendValue={trendValue} />
      )}
    </div>
  );
}

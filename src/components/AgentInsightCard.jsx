import React from "react";
import { cn } from "@/lib/utils";
import { Bot, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgentContext } from "@/context/AgentContext";

const SEVERITY_STYLES = {
  info: "border-l-[#0FD68C]",
  warning: "border-l-amber-500",
  critical: "border-l-red-500",
};

const SEVERITY_ICON_BG = {
  info: "bg-[#0FD68C]/15 text-[#0FD68C]",
  warning: "bg-amber-500/15 text-amber-400",
  critical: "bg-red-500/15 text-red-400",
};

export default function AgentInsightCard({ insight }) {
  const { dispatch } = useAgentContext();

  if (!insight) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg bg-white/[0.04] border border-white/[0.08] border-l-2 px-4 py-3",
        SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.info
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg shrink-0 mt-0.5",
          SEVERITY_ICON_BG[insight.severity] || SEVERITY_ICON_BG.info
        )}
      >
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/90">
            {insight.title}
          </span>
          <span className="text-[9px] font-mono text-white/40">
            {Math.round(insight.confidence * 100)}%
          </span>
        </div>
        <p className="text-[11px] text-white/55 leading-relaxed">
          {insight.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] text-[#0FD68C] hover:text-[#0FD68C] hover:bg-[#0FD68C]/10 gap-1 px-2"
          >
            <ArrowRight className="h-3 w-3" /> {insight.suggestedAction}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              dispatch({ type: "DISMISS_INSIGHT", payload: insight.id })
            }
            className="h-6 text-[10px] text-white/40 hover:text-white/60 px-1.5 ml-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

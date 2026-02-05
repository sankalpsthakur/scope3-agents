import React from "react";
import { cn } from "@/lib/utils";

const STAGE_CONFIG = {
  strategy: {
    color: "bg-[#1BB892]/25 text-[#1BB892] border-[#1BB892]/40",
    label: "Strategy",
  },
  calculation: {
    color: "bg-[#2B5AEE]/25 text-[#2B5AEE] border-[#2B5AEE]/40",
    label: "Calculate",
  },
  execution: {
    color: "bg-[#0DC2E6]/25 text-[#0DC2E6] border-[#0DC2E6]/40",
    label: "Execute",
  },
  reports: {
    color: "bg-[#9366E8]/25 text-[#9366E8] border-[#9366E8]/40",
    label: "Report",
  },
};

export default function PageHeader({ title, subtitle, stage, actions }) {
  const stageConfig = stage ? STAGE_CONFIG[stage] : null;

  return (
    <div className="flex items-start justify-between gap-4 pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {stageConfig && (
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2.5 py-0.5",
                "text-[10px] font-display uppercase tracking-widest",
                stageConfig.color
              )}
            >
              {stageConfig.label}
            </span>
          )}
          <h2 className="text-2xl font-display font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-white/65 max-w-2xl">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

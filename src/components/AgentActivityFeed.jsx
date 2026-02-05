import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Check, AlertCircle, Clock } from "lucide-react";
import { useActivityLog } from "@/context/AgentContext";

const RESULT_STYLES = {
  completed: { icon: Check, className: "text-[#0FD68C]" },
  pending_review: { icon: Clock, className: "text-amber-400" },
  needs_attention: { icon: AlertCircle, className: "text-red-400" },
};

function formatTimeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AgentActivityFeed() {
  const activityLog = useActivityLog();
  const [filter, setFilter] = useState("all");

  const filtered = activityLog.filter((entry) => {
    if (filter === "agent") return entry.actorType === "agent";
    if (filter === "human") return entry.actorType === "human";
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {["all", "agent", "human"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors",
              filter === f
                ? "bg-[#0FD68C]/15 text-[#0FD68C]"
                : "text-white/50 hover:text-white/70 hover:bg-white/[0.06]"
            )}
          >
            {f === "all" ? "All" : f === "agent" ? "Agent" : "Human"}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {filtered.slice(0, 10).map((entry) => {
          const result =
            RESULT_STYLES[entry.result] || RESULT_STYLES.completed;
          const ResultIcon = result.icon;
          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 hover:bg-white/[0.06] transition-colors"
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5",
                  entry.actorType === "agent"
                    ? "bg-[#0FD68C]/15"
                    : "bg-white/10"
                )}
              >
                {entry.actorType === "agent" ? (
                  <Bot className="h-3 w-3 text-[#0FD68C]" />
                ) : (
                  <User className="h-3 w-3 text-white/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-white/80">
                    {entry.actor}
                  </span>
                  <span className="text-[9px] font-mono text-white/35">
                    {formatTimeAgo(entry.timestamp)}
                  </span>
                  <ResultIcon
                    className={cn(
                      "h-3 w-3 ml-auto shrink-0",
                      result.className
                    )}
                  />
                </div>
                <p className="text-[11px] text-white/50 mt-0.5 truncate">
                  {entry.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

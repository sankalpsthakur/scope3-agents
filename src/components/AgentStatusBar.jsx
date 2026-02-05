import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveAgents } from "@/context/AgentContext";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";

export default function AgentStatusBar() {
  const agents = useActiveAgents();
  const [collapsed, setCollapsed] = useState(false);

  if (agents.length === 0) return null;

  return (
    <div className="border-b border-white/[0.08] bg-[hsl(200,30%,5%)]/80 backdrop-blur-xl">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 px-6 py-2 text-xs text-white/60 hover:text-white/80 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FD68C] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FD68C]" />
        </span>
        <Bot className="h-3.5 w-3.5 text-[#0FD68C]" />
        <span className="font-mono">
          {agents.length} agent{agents.length !== 1 ? "s" : ""} active
        </span>
        {collapsed ? (
          <ChevronDown className="h-3 w-3 ml-auto" />
        ) : (
          <ChevronUp className="h-3 w-3 ml-auto" />
        )}
      </button>

      {!collapsed && (
        <div className="px-6 pb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0FD68C]/15">
                <Bot className="h-3 w-3 text-[#0FD68C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-white/80 truncate">
                    {agent.name}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-mono",
                      agent.status === "running"
                        ? "bg-[#0FD68C]/15 text-[#0FD68C]"
                        : "bg-white/10 text-white/50"
                    )}
                  >
                    {agent.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0FD68C] transition-all duration-500"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-white/50">
                    {agent.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

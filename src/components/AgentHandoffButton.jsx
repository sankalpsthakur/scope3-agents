import React, { useState } from "react";
import { Bot, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AgentHandoffButton({ handoff }) {
  const [status, setStatus] = useState("ready");

  if (!handoff) return null;

  const handleRun = () => {
    setStatus("running");
    setTimeout(() => setStatus("complete"), 3000);
    setTimeout(() => setStatus("ready"), 6000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-[#0FD68C]/30 text-[#0FD68C] hover:bg-[#0FD68C]/10 hover:text-[#0FD68C] gap-2"
        >
          {status === "running" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === "complete" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Bot className="h-3.5 w-3.5" />
          )}
          {status === "running"
            ? "Running..."
            : status === "complete"
              ? "Done"
              : "Delegate to Agent"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0FD68C]/15">
              <Bot className="h-3.5 w-3.5 text-[#0FD68C]" />
            </div>
            <span className="text-sm font-medium text-white/90">
              {handoff.agentName}
            </span>
          </div>
          <p className="text-xs text-white/60">{handoff.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">
              {handoff.estimatedTime}
            </span>
            <Button
              size="sm"
              onClick={handleRun}
              disabled={status === "running"}
              className="h-7 text-xs bg-[#0FD68C] hover:bg-[#0FD68C]/90 text-black font-medium"
            >
              {status === "running" ? "Processing..." : "Run Agent"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

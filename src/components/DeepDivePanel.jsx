import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function DeepDivePanel({ open, onOpenChange, title = "AI Insights", children }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-[420px] sm:w-[480px] border-l border-white/10",
          "bg-[hsl(0,0%,6%)] backdrop-blur-xl"
        )}
      >
        <SheetHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <SheetTitle className="font-display text-lg font-semibold text-white tracking-tight">
              {title}
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pt-4">
          <div className="space-y-4 pr-4">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function DeepDiveTrigger({ onClick, label = "AI Insights" }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 gap-2"
    >
      <Sparkles className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

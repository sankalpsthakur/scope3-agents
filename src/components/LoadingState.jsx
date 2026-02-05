import React from "react";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }) {
  return (
    <div
      className={cn(
        "h-4 rounded-md bg-white/[0.10]",
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  );
}

export default function LoadingState({ rows = 3 }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-2">
        <SkeletonBar className="h-6 w-48" />
        <SkeletonBar className="h-4 w-72" />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <SkeletonBar className="h-3 w-20" />
              <div
                className="h-8 w-8 rounded-lg bg-white/[0.10]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s ease-in-out infinite',
                }}
              />
            </div>
            <SkeletonBar className="h-7 w-24" />
            <SkeletonBar className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Content rows skeleton */}
      <div className="glass-card p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBar className="h-4 w-4 rounded-full shrink-0" />
            <SkeletonBar className={cn("h-4", i % 2 === 0 ? "w-3/4" : "w-1/2")} />
            <SkeletonBar className="h-4 w-16 ml-auto shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

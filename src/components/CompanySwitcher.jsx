import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";
import { Building2, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function CompanySwitcher() {
  const { company, companies, setActiveCompanyId } = useCompany();

  return (
    <div className="p-3 border-t border-white/[0.08]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full glass-card p-3 space-y-1 text-left hover:bg-white/[0.10] transition-colors group">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-white/50" />
              <span className="text-xs font-medium text-white/80 truncate flex-1">
                {company.name}
              </span>
              <ChevronDown className="h-3 w-3 text-white/40 group-hover:text-white/60 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/50">
                FY {company.reportingYear}
              </span>
              <Badge className="bg-white/15 text-white/50 border-white/15 text-[9px] border px-1 py-0">
                {company.industry}
              </Badge>
              <span className="status-dot-success ml-auto" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          className="w-[232px] bg-[hsl(220,20%,7%)] border-white/[0.15]"
        >
          {companies.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setActiveCompanyId(c.id)}
              className={cn(
                "flex items-start gap-3 py-2.5 px-3 cursor-pointer",
                "focus:bg-white/10 focus:text-white"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/80 truncate">
                    {c.name}
                  </span>
                  {c.id === company.id && (
                    <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/50">{c.industry}</span>
                  <span className="text-[10px] font-mono text-white/40">
                    {c.revenue}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

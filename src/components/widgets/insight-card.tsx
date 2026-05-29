import { AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/mock-data";

const styleMap = {
  critical: { ring: "border-destructive/40 bg-destructive/5", icon: AlertTriangle, color: "text-destructive" },
  warning:  { ring: "border-warning/40 bg-warning/5", icon: AlertTriangle, color: "text-warning" },
  success:  { ring: "border-success/40 bg-success/5", icon: CheckCircle2, color: "text-success" },
  info:     { ring: "border-info/40 bg-info/5", icon: Info, color: "text-info" },
} as const;

export function InsightCard({ insight }: { insight: Insight }) {
  const s = styleMap[insight.severity];
  const Icon = s.icon;
  return (
    <div className={cn("rounded-xl border p-4", s.ring)}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-md bg-background/40 p-1.5", s.color)}><Icon className="h-4 w-4" /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{insight.scope}</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Sparkles className="h-2.5 w-2.5" /> IA</span>
          </div>
          <h4 className="mt-0.5 text-sm font-medium leading-snug">{insight.title}</h4>
          <p className="mt-1 text-xs text-muted-foreground">{insight.detail}</p>
          {insight.action && (
            <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">{insight.action}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

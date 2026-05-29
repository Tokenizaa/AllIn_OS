import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, subtitle, actions, eyebrow, className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-border/60", className)}>
      <div>
        {eyebrow && <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Pedir ao Copiloto
        </Button>
      </div>
    </div>
  );
}

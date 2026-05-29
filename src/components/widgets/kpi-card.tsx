import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  spark,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  spark?: number[];
  accent?: "primary" | "success" | "warning" | "destructive";
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-success" : "text-destructive")}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {spark && spark.length > 0 && <Sparkline values={spark} accent={accent} />}
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const w = 80, h = 28;
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / span) * h}`).join(" ");
  const stroke = accent === "success" ? "var(--color-success)" : accent === "destructive" ? "var(--color-destructive)" : "var(--color-primary)";
  return (
    <svg width={w} height={h} className="opacity-90">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

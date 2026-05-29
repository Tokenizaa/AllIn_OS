import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { alerts } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/alerts")({ component: AlertsPage });

function AlertsPage() {
  const all = [...alerts, ...alerts.map((a, i) => ({ ...a, id: a.id + "b" + i })), ...alerts.map((a, i) => ({ ...a, id: a.id + "c" + i }))];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive" title="Alertas operacionais" subtitle="Eventos críticos detectados em todos os domínios da plataforma." />
      <div className="rounded-xl border border-border bg-card/40 divide-y divide-border/60">
        {all.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3">
            <span className={`h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-info"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.domain} · {a.at}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

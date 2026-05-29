import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const flags = [
    { id: "ai_copilot", label: "Copiloto IA habilitado", desc: "Ativa o painel de assistência inteligente em toda a plataforma." },
    { id: "anomaly_engine", label: "Motor de anomalias", desc: "Detecção automática de outliers em transações e operações." },
    { id: "auto_workflows", label: "Workflows automáticos", desc: "Permite que a IA dispare automações baseadas em sinais." },
    { id: "realtime", label: "Realtime everywhere", desc: "Eventos em tempo real para todas as entidades operacionais." },
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sistema" title="Configurações" subtitle="Feature flags, tenant, integrações e preferências da plataforma." />
      <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
        <h3 className="text-sm font-semibold">Feature flags</h3>
        {flags.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 py-2 border-t border-border/60 first:border-t-0">
            <div>
              <Label htmlFor={f.id} className="text-sm">{f.label}</Label>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
            <Switch id={f.id} defaultChecked />
          </div>
        ))}
      </div>
    </div>
  );
}

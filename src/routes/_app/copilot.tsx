import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Sparkles, Workflow, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/copilot")({ component: CopilotPage });

const prompts = [
  { icon: TrendingUp, title: "Resumir performance da última semana", category: "Executivo" },
  { icon: AlertTriangle, title: "Quais distribuidores estão prestes a churnar?", category: "CRM" },
  { icon: Workflow, title: "Sugira automação de recompra para Bronze", category: "Automação" },
  { icon: Sparkles, title: "Onde aumentar estoque agora?", category: "Comercial" },
];

function CopilotPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Intelligence" title="Copiloto Allin" subtitle="Action-driven · Multi-tenant · Conhece toda a operação." />
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/5 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-white"><Sparkles className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-semibold">Como posso ajudar você hoje?</h2>
            <p className="text-xs text-muted-foreground">Faça perguntas em linguagem natural ou execute ações operacionais.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border border-border bg-background/80 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40" placeholder="Ex.: gere o relatório de comissões do último ciclo e me mostre anomalias…" />
          <Button>Enviar</Button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {prompts.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.title} className="text-left rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4 text-primary" /> {p.category}</div>
              <p className="mt-1.5 text-sm font-medium">{p.title}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

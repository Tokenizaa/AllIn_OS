import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Workflow } from "lucide-react";

export function CopilotDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const suggestions = [
    { icon: TrendingUp, title: "Resumir a performance dos últimos 7 dias" },
    { icon: AlertTriangle, title: "Listar distribuidores com alto risco de churn" },
    { icon: Workflow, title: "Sugerir automação para reativar inativos" },
    { icon: Sparkles, title: "Quais produtos devo aumentar estoque?" },
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Copiloto Allin</SheetTitle>
          <SheetDescription>Contexto da plataforma · Action-driven · Multi-tenant</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-sm">
              Olá. Detectei <span className="text-primary font-medium">3 sinais relevantes</span> nas últimas horas. Quer que eu resuma o estado operacional ou execute uma ação específica?
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sugestões contextuais</p>
            {suggestions.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.title} className="w-full text-left rounded-lg border border-border bg-card/40 px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="flex-1">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="Pergunte ou descreva uma ação…"
            />
            <Button size="sm">Enviar</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

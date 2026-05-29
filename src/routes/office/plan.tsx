import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowUp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { plansCatalog, distributor, formatBRL } from "@/lib/distributor-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/office/plan")({ component: PlanPage });

function PlanPage() {
  const current = plansCatalog.find((p) => p.atual)!;
  const next = plansCatalog.find((p) => p.destaque)!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Plano</h1>
        <p className="text-sm text-muted-foreground">Acompanhe seus benefícios, percentuais e oportunidades de upgrade.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent p-6">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <Badge className="bg-primary/20 text-primary border-primary/30"><Crown className="h-3 w-3 mr-1" /> Plano atual</Badge>
            <h2 className="mt-2 text-3xl font-bold">{current.nome}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ativo desde {new Date(distributor.ativacao).toLocaleDateString("pt-BR")}</p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Metric label="Bônus máximo" value={`${current.bonus}%`} />
              <Metric label="Gerações" value={String(current.geracoes)} />
              <Metric label="Mensalidade" value={formatBRL(current.preco)} />
            </div>

            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Benefícios</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {current.beneficios.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
          <Badge variant="outline" className="border-border/60"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Recomendação IA</Badge>
          <h3 className="mt-3 text-lg font-bold">Upgrade para {next.nome}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Com seu ritmo atual, o ROI do {next.nome} chega em 47 dias.</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Projeção de ganho</span>
              <span className="font-semibold text-success">+38%</span>
            </div>
            <Progress value={72} className="h-1.5" />
          </div>
          <Button className="mt-4 w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
            <ArrowUp className="h-3.5 w-3.5" /> Fazer upgrade
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Comparação de planos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plansCatalog.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className={cn(
                "relative rounded-2xl border p-5",
                p.atual ? "border-primary/40 bg-primary/5" : p.destaque ? "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 to-transparent" : "border-border/60 bg-card/60",
              )}
            >
              {p.atual && <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30 text-[10px]">Atual</Badge>}
              {p.destaque && !p.atual && <Badge className="absolute top-3 right-3 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 text-[10px]">Topo</Badge>}
              <h4 className="text-lg font-bold">{p.nome}</h4>
              <p className="mt-1 text-2xl font-bold">{formatBRL(p.preco)}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <span>Bônus {p.bonus}%</span>
                <span>·</span>
                <span>{p.geracoes} gerações</span>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs">
                {p.beneficios.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-1.5"><Check className="h-3 w-3 mt-0.5 text-success shrink-0" /> {b}</li>
                ))}
              </ul>
              {!p.atual && <Button size="sm" variant="outline" className="mt-4 w-full">Selecionar</Button>}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de upgrades</h3>
        <ul className="mt-3 space-y-2">
          {[
            { from: "Starter", to: "Pro", date: "12/04/2023" },
            { from: "Pro", to: "Elite", date: "08/11/2024" },
          ].map((h, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm">
              <span><span className="text-muted-foreground">{h.from}</span> → <span className="font-semibold">{h.to}</span></span>
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
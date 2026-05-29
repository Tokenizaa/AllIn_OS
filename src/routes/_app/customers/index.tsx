import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customers, formatBRL } from "@/lib/mock-data";
import { ArrowUpRight, Filter, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersPage });

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  churned: "bg-muted text-muted-foreground border-border",
};

function CustomersPage() {
  const [q, setQ] = useState("");
  const [qual, setQual] = useState<string>("all");
  const filtered = useMemo(() => customers.filter((c) =>
    (qual === "all" || c.qualification === qual) &&
    (q === "" || c.nome_completo.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q.toLowerCase()))
  ), [q, qual]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Distribuidores"
        subtitle={`${customers.length.toLocaleString("pt-BR")} registros · ${customers.filter(c=>c.status==="active").length} ativos · IA monitora padrões em tempo real`}
        actions={<Button size="sm">Novo distribuidor</Button>}
      />

      {/* AI strip */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm flex-1 min-w-0">
          <span className="font-medium">12 distribuidores</span> com risco alto de churn detectados. <span className="text-muted-foreground">Workflow de reativação disponível.</span>
        </p>
        <Button size="sm" variant="outline">Disparar workflow</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou email…" className="h-9 pl-8 bg-card/60" />
        </div>
        <div className="flex gap-1.5">
          {["all","Bronze","Prata","Ouro","Diamante","Black"].map((q) => (
            <button
              key={q}
              onClick={() => setQual(q)}
              className={cn(
                "rounded-md border border-border px-3 py-1.5 text-xs",
                qual === q ? "bg-primary text-primary-foreground border-primary" : "bg-card/40 text-muted-foreground hover:text-foreground",
              )}
            >{q === "all" ? "Todas qualificações" : q}</button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="ml-auto gap-1.5"><Filter className="h-3.5 w-3.5" /> Mais filtros</Button>
      </div>

      {/* Modern table */}
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-left">
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Distribuidor</th>
              <th className="px-4 py-2.5 font-medium">Qualificação</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
              <th className="px-4 py-2.5 font-medium text-right">LTV</th>
              <th className="px-4 py-2.5 font-medium">Score IA</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.slice(0, 40).map((c) => (
              <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium">
                      {c.nome_completo.split(" ").map((p: string) => p[0]).slice(0,2).join("")}
                    </div>
                    <div>
                      <Link to="/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">{c.nome_completo}</Link>
                      <div className="text-[11px] text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{c.qualification}</Badge></td>
                <td className="px-4 py-3"><span className={cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize", statusStyles[c.status])}>{c.status}</span></td>
                <td className="px-4 py-3 text-right tabular-nums">{c.numero_pedidos}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(c.ltv)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full", c.score > 70 ? "bg-success" : c.score > 45 ? "bg-warning" : "bg-destructive")} style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-[11px] tabular-nums text-muted-foreground">{c.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to="/customers/$id" params={{ id: c.id }} className="inline-flex items-center gap-0.5 text-xs text-primary">Abrir 360 <ArrowUpRight className="h-3 w-3" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { customers, customerTimeline, formatBRL, orders } from "@/lib/mock-data";
import { Timeline } from "@/components/widgets/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, MapPin, Phone, Shield, Sparkles, Wallet, Workflow } from "lucide-react";
import { KpiCard } from "@/components/widgets/kpi-card";

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  loader: ({ params }) => {
    const c = customers.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { customer: c };
  },
});

function Customer360() {
  const { customer: c } = Route.useLoaderData();
  const tl = customerTimeline(c.id);
  const myOrders = orders.filter((o) => o.customer_id === c.id);
  const sponsor = c.sponsor_id ? customers.find((x) => x.id === c.sponsor_id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/customers" className="hover:text-foreground">Distribuidores</Link>
        <span>/</span>
        <span className="text-foreground">{c.nome_completo}</span>
      </div>

      <PageHeader
        eyebrow="Customer 360"
        title={c.nome_completo}
        subtitle={`${c.plan_name} · ${c.qualification} · ativo desde ${new Date(c.activation_date).toLocaleDateString("pt-BR")}`}
        actions={
          <>
            <Button size="sm" variant="outline" className="gap-1.5"><Workflow className="h-3.5 w-3.5" /> Workflow</Button>
            <Button size="sm" variant="outline" className="gap-1.5"><Mail className="h-3.5 w-3.5" /> Mensagem</Button>
            <Button size="sm">Ações</Button>
          </>
        }
      />

      {/* Identity strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white">
              {c.nome_completo.split(" ").map((p: string) => p[0]).slice(0,2).join("")}
            </div>
            <div>
              <p className="font-semibold">{c.nome_completo}</p>
              <p className="text-xs text-muted-foreground">{c.id}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {c.email}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {c.telefone}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {c.city}/{c.state}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Shield className="h-3.5 w-3.5" /> CPF {c.cpf}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{c.qualification}</Badge>
            <Badge variant="outline">{c.plan_name}</Badge>
            <Badge variant="outline" className="capitalize">{c.status}</Badge>
          </div>
          {sponsor && (
            <div className="rounded-md border border-border bg-background/40 p-2 text-xs">
              <p className="text-muted-foreground">Patrocinador</p>
              <Link to="/customers/$id" params={{ id: sponsor.id }} className="font-medium hover:text-primary">{sponsor.nome_completo}</Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="LTV" value={formatBRL(c.ltv)} hint="Lifetime value previsto" />
          <KpiCard label="Total comprado" value={formatBRL(c.total_compras)} hint={`${c.numero_pedidos} pedidos`} />
          <KpiCard label="Score IA" value={`${c.score}/100`} delta={c.score - 50} hint="Engajamento + recompra" accent={c.score > 60 ? "success" : "warning"} />
          <KpiCard label="Risco de churn" value={`${(c.churn_risk*100).toFixed(0)}%`} delta={-2.1} hint="Probabilidade 30d" accent={c.churn_risk > 0.5 ? "destructive" : "success"} />

          <div className="col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm"><span className="font-medium">Recomendação do Copiloto:</span> ofertar upgrade para Elite com bônus de ativação. Probabilidade de conversão estimada em 71%.</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm">Aplicar ação</Button>
                <Button size="sm" variant="outline">Ver raciocínio</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-card/60 border border-border">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="orders">Pedidos ({myOrders.length})</TabsTrigger>
          <TabsTrigger value="wallet">Carteira & Bônus</TabsTrigger>
          <TabsTrigger value="network">Rede</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold mb-4">Timeline operacional</h3>
            <Timeline events={tl} />
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-5 space-y-3">
            <h3 className="text-sm font-semibold">Quick actions</h3>
            {["Aprovar saque","Liberar bônus","Gerar link inteligente","Solicitar verificação","Criar nota","Disparar campanha"].map((a) => (
              <button key={a} className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-left text-sm hover:bg-accent transition-colors">{a}</button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Pedido</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">Pagamento</th><th className="px-4 py-2.5 text-right">Valor</th><th className="px-4 py-2.5 text-left">Data</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {myOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido}</td>
                    <td className="px-4 py-3 capitalize">{o.status_pedido}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.payment_method} · {o.payment_status}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatBRL(o.valor_total_pedido)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
                {myOrders.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Sem pedidos.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="grid md:grid-cols-3 gap-4">
          <KpiCard label="Saldo carteira" value={formatBRL(c.total_compras * 0.08)} hint="Disponível para saque" />
          <KpiCard label="Bônus do mês" value={formatBRL(c.total_compras * 0.04)} delta={6.3} accent="success" />
          <KpiCard label="Comissões pendentes" value={formatBRL(c.total_compras * 0.02)} accent="warning" />
          <div className="md:col-span-3 rounded-xl border border-border bg-card/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Movimentações recentes</h3>
              <Button size="sm" variant="outline">Exportar</Button>
            </div>
            <ul className="divide-y divide-border/60 text-sm">
              {["Bônus binário","Saque aprovado","Comissão direta","Bônus de ativação"].map((t, i) => (
                <li key={t} className="flex items-center justify-between py-2">
                  <span>{t}</span>
                  <span className={i % 2 ? "text-destructive" : "text-success"}>{i % 2 ? "-" : "+"} {formatBRL((i+1)*120.5)}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="rounded-xl border border-border bg-card/60 p-8 text-sm text-muted-foreground text-center">
            Visualização de genealogia (em construção) · <Link to="/network" className="text-primary">abrir Genealogia</Link>
          </div>
        </TabsContent>
        <TabsContent value="docs">
          <div className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">KYC concluído · CPF, RG e comprovante de endereço verificados.</div>
        </TabsContent>
        <TabsContent value="automations">
          <div className="rounded-xl border border-border bg-card/60 p-6 text-sm">3 automações ativas: <span className="text-muted-foreground">recompra recorrente, alerta de inatividade, parabéns de aniversário.</span></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

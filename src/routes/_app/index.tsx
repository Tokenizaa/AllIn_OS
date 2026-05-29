import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Cell, Pie, PieChart } from "recharts";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { InsightCard } from "@/components/widgets/insight-card";
import { alerts, channelMix, customers, formatBRL, insights, kpis, networkLegs, orders, revenueSeries } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

function Dashboard() {
  const spark = revenueSeries.slice(-12).map((d) => d.receita);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive Layer"
        title="Operação em tempo real"
        subtitle="Visão consolidada de receita, ativações, rede MLM e inteligência operacional do dia."
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Receita do mês" value={formatBRL(kpis.receita_mes)} delta={kpis.receita_var} spark={spark} accent="primary" />
        <KpiCard label="Pedidos" value={kpis.pedidos_mes.toLocaleString("pt-BR")} delta={kpis.pedidos_var} spark={spark.map(v=>v*0.9)} accent="success" />
        <KpiCard label="Ativações" value={kpis.ativacoes_mes.toLocaleString("pt-BR")} delta={kpis.ativacoes_var} spark={spark.map(v=>v*0.7)} accent="warning" />
        <KpiCard label="Ticket médio" value={formatBRL(kpis.ticket_medio)} delta={kpis.ticket_var} spark={spark.map(v=>v*1.1)} />
        <KpiCard label="Distribuidores ativos" value={kpis.distribuidores_ativos.toLocaleString("pt-BR")} delta={kpis.distribuidores_var} />
        <KpiCard label="Churn" value={`${kpis.churn}%`} delta={kpis.churn_var} accent="destructive" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Receita · últimos 30 dias</h3>
              <p className="text-xs text-muted-foreground">Comparativo com meta e período anterior.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <LegendDot color="var(--color-primary)" label="Receita" />
              <LegendDot color="var(--color-info)" label="Ano anterior" />
              <LegendDot color="var(--color-muted-foreground)" label="Meta" />
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="receita" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
                <Area type="monotone" dataKey="ano_anterior" stroke="var(--color-info)" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="meta" stroke="var(--color-muted-foreground)" strokeWidth={1} fill="transparent" strokeDasharray="2 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel mix */}
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Mix por tipo de compra</h3>
          <p className="text-xs text-muted-foreground">Distribuição operacional do mês.</p>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelMix} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                  {channelMix.map((_, i) => (
                    <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5">
            {channelMix.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-chart-${(i % 5) + 1})` }} />
                  {c.name}
                </span>
                <span className="font-medium">{c.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Insights + Alerts + Recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">Insights da IA</h3>
            <Link to="/insights" className="text-xs text-primary inline-flex items-center gap-0.5">Ver todos <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {insights.slice(0, 4).map((i) => <InsightCard key={i.id} insight={i} />)}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">Alertas operacionais</h3>
            <Badge variant="outline" className="text-[10px]">live</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-2.5">
                <span className={`mt-1 h-2 w-2 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-info"}`} />
                <div className="flex-1">
                  <p className="text-xs font-medium leading-tight">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{a.domain} · {a.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Network legs + Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Rede binária · pernas E/D por semana</h3>
          <p className="text-xs text-muted-foreground">Equilíbrio operacional da rede MLM.</p>
          <div className="h-60 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkLegs}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="esquerda" fill="var(--color-primary)" radius={[4,4,0,0]} />
                <Bar dataKey="direita" fill="var(--color-chart-2)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Top distribuidores</h3>
          <p className="text-xs text-muted-foreground">Por receita acumulada.</p>
          <ul className="mt-3 space-y-2">
            {[...customers].sort((a,b)=>b.total_compras-a.total_compras).slice(0,6).map((c, i) => (
              <li key={c.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <Link to="/customers/$id" params={{ id: c.id }} className="text-sm font-medium truncate hover:text-primary block">{c.nome_completo}</Link>
                  <p className="text-[11px] text-muted-foreground">{c.qualification} · {c.city}/{c.state}</p>
                </div>
                <span className="text-xs font-semibold">{formatBRL(c.total_compras)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

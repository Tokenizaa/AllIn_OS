import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Wallet, ShoppingBag, Users, TrendingUp, Crown, Sparkles, ArrowUpRight,
  Copy, Share2, Send, UserPlus, Trophy, Target, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/distributor/stat-card";
import {
  distributor, wallet, kpis, salesSeries, bonusOrigin, topProducts,
  timeline, aiInsights, goals, formatBRL, relTime,
} from "@/lib/distributor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/office/")({ component: Dashboard });

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-cyan-400/5 p-6 md:p-8"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                <Crown className="h-3 w-3 mr-1" /> {distributor.qualificacao}
              </Badge>
              <Badge variant="outline" className="border-border/60">{distributor.plano}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Olá, {distributor.nome.split(" ")[0]} 👋
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
              Você está a <span className="text-primary font-semibold">{100 - distributor.progresso_qualificacao}%</span> da
              qualificação <span className="font-semibold text-foreground">{distributor.proxima_qualificacao}</span>.
              Sua rede cresceu <span className="text-success font-semibold">+{kpis.crescimento_rede_mes}%</span> este mês.
            </p>
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progresso até {distributor.proxima_qualificacao}</span>
                <span className="font-semibold">{distributor.progresso_qualificacao}%</span>
              </div>
              <Progress value={distributor.progresso_qualificacao} className="h-2" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(distributor.link_loja); toast.success("Link copiado!"); }}>
              <Copy className="h-3.5 w-3.5" /> Link da loja
            </Button>
            <Button size="sm" variant="outline" className="gap-2"><Share2 className="h-3.5 w-3.5" /> Compartilhar</Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500"><UserPlus className="h-3.5 w-3.5" /> Cadastrar</Button>
          </div>
        </div>
      </motion.div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Saldo disponível" value={formatBRL(wallet.saldo_disponivel)} delta={9.2} icon={Wallet} accent="success" hint="Sacar via PIX em até 5 min" />
        <StatCard label="Comissão acumulada" value={formatBRL(kpis.comissao_acumulada)} delta={14.6} icon={Trophy} accent="primary" />
        <StatCard label="Total vendido" value={formatBRL(kpis.total_vendido)} delta={11.4} icon={TrendingUp} accent="info" />
        <StatCard label="Cadastros diretos" value={String(kpis.cadastros_diretos)} delta={22.0} icon={UserPlus} accent="warning" hint="Meta: 50" />
        <StatCard label="Pedidos do mês" value={String(kpis.pedidos_mes)} delta={6.8} icon={ShoppingBag} accent="primary" />
        <StatCard label="Rede total" value={kpis.rede_total.toLocaleString("pt-BR")} delta={kpis.crescimento_rede_mes} icon={Users} accent="success" />
        <StatCard label="Ticket médio" value={formatBRL(kpis.ticket_medio)} delta={3.1} icon={Target} accent="info" />
        <StatCard label="Conversão loja" value={`${kpis.conversao_loja}%`} delta={1.2} icon={Zap} accent="warning" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Vendas & Bônus · últimos 30 dias</h3>
              <p className="text-xs text-muted-foreground">Acompanhe sua evolução diária.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Vendas</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Bônus</span>
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="vendas" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="bonus" stroke="var(--color-success)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Origem dos bônus</h3>
          <p className="text-xs text-muted-foreground">Distribuição do mês.</p>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bonusOrigin} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {bonusOrigin.map((_, i) => <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5">
            {bonusOrigin.map((b, i) => (
              <li key={b.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: `var(--color-chart-${(i % 5) + 1})` }} />{b.name}</span>
                <span className="font-medium">{b.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Insights + Goals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Insights do Copiloto</h3>
            <Link to="/office/copilot" className="text-xs text-primary inline-flex items-center gap-0.5">Abrir copiloto <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {aiInsights.map((i) => (
              <motion.div key={i.id} whileHover={{ y: -2 }} className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-lg grid place-items-center ${
                    i.severity === "success" ? "bg-success/15 text-success" :
                    i.severity === "warning" ? "bg-warning/15 text-warning" : "bg-info/15 text-info"
                  }`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{i.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{i.detail}</p>
                    <Button size="sm" variant="ghost" className="mt-2 -ml-2 h-7 text-xs text-primary">{i.action} →</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Suas metas</h3>
            <Badge variant="outline" className="text-[10px]">mês atual</Badge>
          </div>
          <ul className="mt-4 space-y-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <li key={g.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{g.title}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {g.unit === "BRL" ? formatBRL(g.current) : g.current} de {g.unit === "BRL" ? formatBRL(g.target) : g.target}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Timeline + Top products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Atividades recentes</h3>
          <p className="text-xs text-muted-foreground">Timeline operacional em tempo real.</p>
          <ul className="mt-4 space-y-3">
            {timeline.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <span className={`mt-0.5 h-2 w-2 rounded-full ${
                  t.type === "ai" ? "bg-primary" :
                  t.type === "bonus" ? "bg-success" :
                  t.type === "order" ? "bg-info" :
                  t.type === "withdraw" ? "bg-warning" :
                  t.type === "rank" ? "bg-fuchsia-500" : "bg-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{relTime(t.at)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Top produtos</h3>
          <p className="text-xs text-muted-foreground">Mais vendidos por você.</p>
          <div className="h-44 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 12 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} width={120} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="qtd" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {topProducts.slice(0, 3).map((p) => (
              <li key={p.name} className="flex items-center justify-between text-xs">
                <span className="truncate text-muted-foreground">{p.name}</span>
                <span className="font-semibold">{formatBRL(p.receita)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
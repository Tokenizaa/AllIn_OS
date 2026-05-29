import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ArrowDownToLine, TrendingUp, Sparkles, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/distributor/stat-card";
import { wallet, bonusOrigin, formatBRL } from "@/lib/distributor-data";
import { ResponsiveContainer, Tooltip, Cell, Pie, PieChart, Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/office/finance")({ component: FinancePage });

const earnings = Array.from({ length: 12 }).map((_, i) => ({
  mes: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][i],
  valor: 8000 + Math.round(Math.random() * 18000 + i * 800),
}));

const extrato = [
  { id: "e1", desc: "Bônus binário", tipo: "Crédito", valor: 1240.5, data: "28/05" },
  { id: "e2", desc: "Bônus unilevel", tipo: "Crédito", valor: 980.0, data: "27/05" },
  { id: "e3", desc: "Saque PIX", tipo: "Débito", valor: -5000.0, data: "25/05" },
  { id: "e4", desc: "Cashback recompra", tipo: "Crédito", valor: 142.8, data: "24/05" },
  { id: "e5", desc: "Comissão ativação", tipo: "Crédito", valor: 720.0, data: "22/05" },
];

function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Sua carteira, ganhos e previsões inteligentes.</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500"><ArrowDownToLine className="h-4 w-4" /> Solicitar saque</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-transparent p-6">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Saldo disponível</p>
            <p className="mt-2 text-4xl md:text-5xl font-bold">{formatBRL(wallet.saldo_disponivel)}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Mini icon={Lock} label="Bloqueado" value={formatBRL(wallet.saldo_bloqueado)} />
              <Mini icon={Clock} label="A liberar" value={formatBRL(wallet.saldo_a_liberar)} />
              <Mini icon={TrendingUp} label="Ganho no mês" value={formatBRL(wallet.total_ganho_mes)} />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5">
          <Badge variant="outline" className="border-border/60"><Sparkles className="h-3 w-3 mr-1 text-primary" /> Forecast IA</Badge>
          <h3 className="mt-3 text-base font-semibold">Próximos 30 dias</h3>
          <p className="mt-1 text-2xl font-bold text-success">+{formatBRL(28_400)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Baseado na sua taxa de recompra e crescimento da rede.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ganho no ano" value={formatBRL(wallet.total_ganho_ano)} delta={32.4} icon={Wallet} accent="success" />
        <StatCard label="Saques realizados" value="14" delta={8.0} accent="info" />
        <StatCard label="Bônus pendentes" value={formatBRL(wallet.saldo_a_liberar)} accent="warning" hint="Libera em 7 dias" />
        <StatCard label="Próxima liberação" value="04/06" accent="primary" hint="R$ 4.120,18" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Ganhos por mês</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings}>
                <defs>
                  <linearGradient id="ge" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="valor" stroke="var(--color-success)" fill="url(#ge)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Origem dos ganhos</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bonusOrigin} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                  {bonusOrigin.map((_, i) => <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3">Extrato recente</h3>
        <ul className="space-y-2">
          {extrato.map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3 text-sm">
              <div>
                <p className="font-medium">{e.desc}</p>
                <p className="text-xs text-muted-foreground">{e.tipo} · {e.data}</p>
              </div>
              <span className={`font-semibold ${e.valor >= 0 ? "text-success" : "text-destructive"}`}>{formatBRL(e.valor)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider"><Icon className="h-3 w-3" /> {label}</div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
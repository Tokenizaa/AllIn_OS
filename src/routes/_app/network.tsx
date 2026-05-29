import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { ResponsiveContainer, Treemap, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { customers, networkLegs } from "@/lib/mock-data";
import { KpiCard } from "@/components/widgets/kpi-card";

export const Route = createFileRoute("/_app/network")({ component: NetworkPage });

function NetworkPage() {
  const data = customers.slice(0, 20).map((c) => ({ name: c.nome_completo.split(" ")[0], size: c.numero_pedidos * 100 }));
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Genealogia inteligente" subtitle="Distribuição binária, qualificações e ciclos com inteligência embarcada." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total na rede" value="28.410" delta={2.1} accent="primary" />
        <KpiCard label="Qualificados (mês)" value="1.204" delta={9.4} accent="success" />
        <KpiCard label="Equilíbrio binário" value="94%" delta={1.8} />
        <KpiCard label="Ciclos pagos" value="3.842" delta={-1.2} accent="warning" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Pernas binárias por semana</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkLegs}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="esquerda" stackId="a" fill="var(--color-primary)" />
                <Bar dataKey="direita" stackId="a" fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Mapa de calor da rede (top 20)</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap data={data} dataKey="size" stroke="var(--color-background)" fill="var(--color-primary)" />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

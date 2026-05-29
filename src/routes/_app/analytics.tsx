import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { revenueSeries, channelMix, networkLegs } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentAnalytics } from "@/components/payments/analytics";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const cohort = Array.from({ length: 12 }).map((_, i) => ({ mes: `M${i+1}`, retencao: Math.max(20, 100 - i * 7 - Math.random() * 5) }));
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive" title="Analytics" subtitle="KPIs operacionais, coorte de retenção, mix e performance da rede." />
      
      <Tabs defaultValue="operacional" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="operacional" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card title="Receita vs ano anterior">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueSeries}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickFormatter={(v)=>`${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={ttStyle} />
                  <Area dataKey="receita" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
                  <Area dataKey="ano_anterior" stroke="var(--color-info)" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Coorte de retenção (12 meses)">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={cohort}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="mes" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={ttStyle} />
                  <Line dataKey="retencao" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Mix por tipo de compra">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={channelMix} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3} stroke="none">
                    {channelMix.map((_, i) => <Cell key={i} fill={`var(--color-chart-${(i%5)+1})`} />)}
                  </Pie>
                  <Tooltip contentStyle={ttStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Pernas binárias por semana">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={networkLegs}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={ttStyle} />
                  <Bar dataKey="esquerda" fill="var(--color-primary)" />
                  <Bar dataKey="direita" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pagamentos">
          <PaymentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ttStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

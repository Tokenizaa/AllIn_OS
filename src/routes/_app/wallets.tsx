import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { formatBRL } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletDashboard } from "@/components/payments/wallet-dashboard";
import { PaymentHistory } from "@/components/payments/payment-history";

export const Route = createFileRoute("/_app/wallets")({ component: WalletsPage });

const saques = Array.from({ length: 14 }).map((_, i) => ({
  id: `sq_${i}`,
  user: ["Ana Souza","Carlos Lima","Mariana Costa","Pedro Almeida","Juliana Ribeiro"][i % 5],
  valor: Math.round((1500 + Math.random() * 60000) * 100) / 100,
  metodo: ["Pix","TED","Carteira"][i % 3],
  status: ["pendente","aprovado","pendente","rejeitado","aprovado"][i % 5],
  risco: Math.random() > 0.75,
}));

function WalletsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financeiro" title="Carteiras & Saques" subtitle="Operações financeiras com detecção automática de anomalias." actions={<Button size="sm">Aprovar em massa</Button>} />
      
      <Tabs defaultValue="saques" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saques">Saques</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="saques" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Saldo total carteiras" value={formatBRL(8_412_900)} accent="primary" />
            <KpiCard label="Saques pendentes" value="42" delta={3.1} accent="warning" />
            <KpiCard label="Saques aprovados (dia)" value="118" />
            <KpiCard label="Anomalias detectadas" value="3" accent="destructive" />
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <p className="text-sm flex-1"><span className="font-medium">3 saques acima de 2σ</span> do padrão. IA recomenda revisão manual.</p>
            <Button size="sm" variant="outline">Revisar</Button>
          </div>

          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Distribuidor</th><th className="px-4 py-2.5 text-right">Valor</th><th className="px-4 py-2.5 text-left">Método</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">IA</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {saques.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3">{s.user}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(s.valor)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.metodo}</td>
                    <td className="px-4 py-3 capitalize">
                      <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] ${s.status === "aprovado" ? "border-success/30 bg-success/10 text-success" : s.status === "rejeitado" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-warning/30 bg-warning/10 text-warning"}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">{s.risco && <span className="text-xs text-destructive">⚠ anomalia</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <WalletDashboard />
        </TabsContent>

        <TabsContent value="historico">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

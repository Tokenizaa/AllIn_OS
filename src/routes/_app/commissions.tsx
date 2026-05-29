import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { formatBRL } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/commissions")({ component: CommissionsPage });

const rows = Array.from({ length: 18 }).map((_, i) => ({
  id: `cm_${i}`,
  ciclo: `Ciclo #${42 - i}`,
  qualificados: 120 + Math.floor(Math.random() * 80),
  pago: Math.round((180000 + Math.random() * 60000) * 100) / 100,
  status: i === 0 ? "processando" : i === 1 ? "pendente" : "pago",
}));

function CommissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rede MLM" title="Comissões & Ciclos" subtitle="Processamento de bônus binário, direto, residual e líder." actions={<Button size="sm">Rodar ciclo</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total pago no mês" value={formatBRL(1_240_500)} delta={6.4} accent="success" />
        <KpiCard label="Bônus médio" value={formatBRL(842.3)} delta={2.1} />
        <KpiCard label="Ciclos no mês" value="12" />
        <KpiCard label="Pendente próximo ciclo" value={formatBRL(184_200)} accent="warning" />
      </div>
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-2.5 text-left">Ciclo</th><th className="px-4 py-2.5 text-right">Qualificados</th><th className="px-4 py-2.5 text-right">Valor pago</th><th className="px-4 py-2.5 text-left">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{r.ciclo}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.qualificados}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatBRL(r.pago)}</td>
                <td className="px-4 py-3 capitalize">
                  <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] ${r.status === "pago" ? "border-success/30 bg-success/10 text-success" : r.status === "processando" ? "border-info/30 bg-info/10 text-info" : "border-warning/30 bg-warning/10 text-warning"}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

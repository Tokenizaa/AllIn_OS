import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { customers, formatBRL, orders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/orders/")({ component: OrdersPage });

const statusColor: Record<string, string> = {
  pago: "bg-success/15 text-success border-success/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  enviado: "bg-info/15 text-info border-info/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Pedidos"
        subtitle={`${orders.length} pedidos no período · ${formatBRL(orders.reduce((s,o)=>s+o.valor_total_pedido,0))} em receita bruta`}
      />
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left">Pedido</th>
              <th className="px-4 py-2.5 text-left">Cliente</th>
              <th className="px-4 py-2.5 text-left">Tipo</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5 text-left">Pagamento</th>
              <th className="px-4 py-2.5 text-right">Itens</th>
              <th className="px-4 py-2.5 text-right">Total</th>
              <th className="px-4 py-2.5 text-left">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.slice(0, 60).map((o) => {
              const c = customers.find((x) => x.id === o.customer_id)!;
              return (
                <tr key={o.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido}</td>
                  <td className="px-4 py-3"><Link to="/customers/$id" params={{ id: c.id }} className="hover:text-primary">{c.nome_completo}</Link></td>
                  <td className="px-4 py-3"><Badge variant="outline" className="capitalize text-[10px]">{o.purchase_type}</Badge></td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize ${statusColor[o.status_pedido]}`}>{o.status_pedido}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{o.payment_method}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{o.items.length}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(o.valor_total_pedido)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

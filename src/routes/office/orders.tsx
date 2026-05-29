import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Search, Filter, Download, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/distributor/stat-card";
import { distOrders, formatBRL } from "@/lib/distributor-data";
import { SectionBreadcrumbs } from "@/components/navigation/section-breadcrumbs";

export const Route = createFileRoute("/office/orders")({ component: OrdersPage });

const statusColors: Record<string, string> = {
  pago: "bg-success/15 text-success border-success/30",
  entregue: "bg-primary/15 text-primary border-primary/30",
  enviado: "bg-info/15 text-info border-info/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  const total = distOrders.reduce((s, o) => s + o.total, 0);
  const ticket = total / distOrders.length;
  return (
    <div className="space-y-6">
      <SectionBreadcrumbs
        items={[
          { label: "Office", to: "/office" },
          { label: "Pedidos" },
        ]}
      />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe, filtre e gerencie todos os seus pedidos.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total comprado" value={formatBRL(total)} delta={12.4} icon={ShoppingBag} accent="primary" />
        <StatCard label="Ticket médio" value={formatBRL(ticket)} delta={4.2} accent="info" />
        <StatCard label="Pedidos no mês" value={String(distOrders.length)} delta={8.1} accent="success" />
        <StatCard label="Em trânsito" value={String(distOrders.filter(o => o.status === "enviado").length)} accent="warning" icon={Truck} />
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60">
        <div className="p-4 flex flex-wrap items-center gap-2 border-b border-border/60">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nº pedido, cliente…" className="pl-9 bg-muted/40" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="h-3.5 w-3.5" /> Filtros</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Exportar</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider">
              <tr className="border-b border-border/60">
                <th className="text-left font-medium px-4 py-3">Pedido</th>
                <th className="text-left font-medium px-4 py-3">Cliente</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Tipo</th>
                <th className="text-left font-medium px-4 py-3">Pagamento</th>
                <th className="text-right font-medium px-4 py-3">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {distOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{o.numero}</td>
                  <td className="px-4 py-3">{o.cliente}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={statusColors[o.status]}>{o.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{o.tipo}</td>
                  <td className="px-4 py-3 text-xs">{o.metodo}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatBRL(o.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs"><RotateCcw className="h-3 w-3" /> Reorder</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

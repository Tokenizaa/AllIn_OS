import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { products, formatBRL } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/products/")({ component: ProductsPage });

function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Comercial" title="Catálogo de produtos" subtitle="Bônus, estoque, variantes e performance em uma visão única." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {products.map((p) => {
          const low = p.stock < 200;
          const out = p.stock === 0;
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.sku}</p>
                  <h3 className="text-base font-semibold mt-0.5">{p.name}</h3>
                </div>
                <Badge variant="outline" className="capitalize text-[10px]">{p.status}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-border bg-background/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Preço</p>
                  <p className="text-sm font-semibold tabular-nums">{formatBRL(p.price)}</p>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bônus</p>
                  <p className="text-sm font-semibold text-primary">{p.bonus_payment_percentage}%</p>
                </div>
                <div className={`rounded-md border p-2 ${out ? "border-destructive/40 bg-destructive/10" : low ? "border-warning/40 bg-warning/10" : "border-border bg-background/40"}`}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estoque</p>
                  <p className={`text-sm font-semibold tabular-nums ${out ? "text-destructive" : low ? "text-warning" : ""}`}>{p.stock}</p>
                </div>
              </div>
              {out && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" /> Sem estoque — IA recomenda repor</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

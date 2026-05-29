import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GatewayManagement } from "@/components/payments/admin/gateway-management";
import { BonusConfiguration } from "@/components/payments/admin/bonus-configuration";
import { FinancialDashboard } from "@/components/payments/admin/financial-dashboard";

export const Route = createFileRoute("/_app/system")({ component: SystemPage });

const logs = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  actor: ["admin@allin.io","ana@allin.io","sistema","carlos@allin.io"][i % 4],
  action: ["UPDATE customer.status","APPROVE withdrawal","CREATE campaign","ROLE granted","LOGIN","DELETE coupon"][i % 6],
  entity: ["customers","wallets","campaigns","user_roles","auth","coupons"][i % 6],
  at: new Date(Date.now() - i * 3600000).toLocaleString("pt-BR"),
}));

function SystemPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sistema" title="Admin & Auditoria" subtitle="Usuários administrativos, permissões, integrações e logs de auditoria." />
      
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="bonus">Bônus</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { t: "Usuários admin", v: "14 ativos", d: "RBAC + SSO" },
              { t: "Integrações", v: "9 conectores", d: "Pix, ERP, CRM, Email" },
              { t: "Feature flags", v: "28 flags", d: "Multi-tenant" },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-border bg-card/60 p-4">
                <p className="text-xs text-muted-foreground">{c.t}</p>
                <p className="text-xl font-semibold mt-1">{c.v}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Audit log</h3>
              <Badge variant="outline" className="text-[10px]">imutável</Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Quem</th><th className="px-4 py-2.5 text-left">Ação</th><th className="px-4 py-2.5 text-left">Entidade</th><th className="px-4 py-2.5 text-left">Quando</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{l.actor}</td>
                    <td className="px-4 py-3"><code className="text-xs">{l.action}</code></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{l.entity}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{l.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="gateways">
          <GatewayManagement />
        </TabsContent>

        <TabsContent value="bonus">
          <BonusConfiguration />
        </TabsContent>

        <TabsContent value="financeiro">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

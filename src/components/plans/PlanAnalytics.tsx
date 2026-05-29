import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface PlanAnalyticsProps {
  analytics: any[];
}

export function PlanAnalytics({ analytics }: PlanAnalyticsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics de Planos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics?.map((plan) => (
          <Card key={plan.plan_id}>
            <CardHeader>
              <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
              <CardDescription>Performance do plano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Distribuidores</span>
                <span className="font-semibold">{plan.total_customers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ativos</span>
                <span className="font-semibold">{plan.active_customers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Receita Total</span>
                <span className="font-semibold">
                  R$ {plan.total_revenue.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ticket Médio</span>
                <span className="font-semibold">
                  R$ {plan.avg_revenue_per_customer.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assinaturas Ativas</span>
                <span className="font-semibold">{plan.active_subscriptions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Novas Ativações (30d)</span>
                <span className="font-semibold">{plan.new_activations_30d}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

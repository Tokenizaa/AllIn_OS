import { useQuery } from "@tanstack/react-query";
import { getAllPlans, getPlanAnalytics } from "../../lib/api/plans.functions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { PlanCard } from "./PlanCard";
import { PlanAnalytics } from "./PlanAnalytics";
import { UpgradeSuggestions } from "./UpgradeSuggestions";

export function PlansDashboard() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlans,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["plan-analytics"],
    queryFn: getPlanAnalytics,
  });

  if (plansLoading || analyticsLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  const totalPlans = plans?.length || 0;
  const totalCustomers = analytics?.reduce((sum, a) => sum + a.total_customers, 0) || 0;
  const totalRevenue = analytics?.reduce((sum, a) => sum + a.total_revenue, 0) || 0;
  const activeSubscriptions = analytics?.reduce((sum, a) => sum + a.active_subscriptions, 0) || 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planos MLM</h1>
          <p className="text-muted-foreground">
            Gerencie planos, bônus e comissões da rede
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
            <p className="text-xs text-muted-foreground">
              Planos ativos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribuidores Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Distribuidores com planos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRevenue.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita gerada por planos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Assinaturas ativas atualmente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Suggestions */}
      <UpgradeSuggestions />

      {/* Plans Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Analytics */}
      <PlanAnalytics analytics={analytics} />
    </div>
  );
}

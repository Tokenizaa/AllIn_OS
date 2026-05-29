import React from 'react';

import { Users, Package, MessageSquare, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

const StatCard = ({ title, value, icon: Icon, description, trend, colorClass = 'text-gray-600' }: StatCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-allin-white/70">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 dark:text-allin-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1 dark:text-allin-white/60">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClass.replace('text', 'bg').replace('600', '100')}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center">
            <TrendingUp className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'} mr-1`} />
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'} dark:text-allin-white`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1 dark:text-allin-white/60">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  usersCount: number;
  productsCount: number;
  conversationsCount: number;
  revenue: number;
  leadsCount: number;
  ordersCount: number;
}

export function DashboardStats({ 
  usersCount, 
  productsCount, 
  conversationsCount, 
  revenue,
  leadsCount,
  ordersCount
}: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total de Usuários"
        value={usersCount.toString()}
        icon={Users}
        description="Usuários cadastrados"
        trend={{ value: 12, isPositive: true }}
        colorClass="text-blue-600"
      />
      
      <StatCard
        title="Produtos Ativos"
        value={productsCount.toString()}
        icon={Package}
        description="Produtos no catálogo"
        trend={{ value: 8, isPositive: true }}
        colorClass="text-green-600"
      />
      
      <StatCard
        title="Conversas do Chat"
        value={conversationsCount.toString()}
        icon={MessageSquare}
        description="Interações hoje"
        trend={{ value: 23, isPositive: true }}
        colorClass="text-purple-600"
      />
      
      <StatCard
        title="Receita Total"
        value={formatCurrency(revenue)}
        icon={DollarSign}
        description="Vendas do mês"
        trend={{ value: 15, isPositive: true }}
        colorClass="text-green-600"
      />
      
      <StatCard
        title="Leads Qualificados"
        value={leadsCount.toString()}
        icon={Users}
        description="Leads com alto potencial"
        trend={{ value: 5, isPositive: true }}
        colorClass="text-orange-600"
      />
      
      <StatCard
        title="Pedidos Realizados"
        value={ordersCount.toString()}
        icon={BarChart3}
        description="Pedidos este mês"
        trend={{ value: 18, isPositive: true }}
        colorClass="text-teal-600"
      />
    </div>
  );
}
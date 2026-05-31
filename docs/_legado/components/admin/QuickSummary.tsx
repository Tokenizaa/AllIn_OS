import React from 'react';

import { Users, Package, MessageSquare, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickSummaryProps {
  users: number;
  products: number;
  conversations: number;
  revenue: number;
  leads: number;
  orders: number;
}

export function QuickSummary({ 
  users, 
  products, 
  conversations, 
  revenue,
  leads,
  orders
}: QuickSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const metrics = [
    {
      title: 'Usuários',
      value: users,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Produtos',
      value: products,
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Conversas',
      value: conversations,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Receita',
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Leads',
      value: leads,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Pedidos',
      value: orders,
      icon: BarChart3,
      color: 'text-teal-500',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Resumo Rápido</CardTitle>
        <CardDescription>
          Visão geral das principais métricas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3"
              >
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
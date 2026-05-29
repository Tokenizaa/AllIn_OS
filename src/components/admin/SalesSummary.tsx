import React from 'react';

import { TrendingUp, ShoppingCart, DollarSign, CreditCard, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

const salesData: SalesData[] = [
  { date: 'Jan', sales: 4000, orders: 240, revenue: 24000 },
  { date: 'Fev', sales: 3000, orders: 139, revenue: 22000 },
  { date: 'Mar', sales: 2000, orders: 980, revenue: 22900 },
  { date: 'Abr', sales: 2780, orders: 390, revenue: 20000 },
  { date: 'Mai', sales: 1890, orders: 480, revenue: 21810 },
  { date: 'Jun', sales: 2390, orders: 380, revenue: 25000 },
];

const topProducts: TopProduct[] = [
  { id: '1', name: 'Tênis Esportivo A', sales: 120, revenue: 12000 },
  { id: '2', name: 'Tênis Esportivo B', sales: 95, revenue: 9500 },
  { id: '3', name: 'Tênis Esportivo C', sales: 80, revenue: 8000 },
  { id: '4', name: 'Tênis Esportivo D', sales: 65, revenue: 6500 },
  { id: '5', name: 'Tênis Esportivo E', sales: 50, revenue: 5000 },
];

export function SalesSummary() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Resumo de Vendas
        </CardTitle>
        <CardDescription>
          Métricas e tendências de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Vendas Totais</span>
            </div>
            <p className="text-2xl font-bold mt-2">1.240</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 30 dias</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Receita Total</span>
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(125800)}</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 30 dias</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Pedidos</span>
            </div>
            <p className="text-2xl font-bold mt-2">89</p>
            <p className="text-xs text-muted-foreground mt-1">hoje</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Produtos Vendidos</span>
            </div>
            <p className="text-2xl font-bold mt-2">1.842</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 30 dias</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Crescimento</span>
            </div>
            <p className="text-2xl font-bold mt-2">+12.5%</p>
            <p className="text-xs text-muted-foreground mt-1">em relação ao mês anterior</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Vendas nos últimos 6 meses</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#F2A801" name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tendência de Pedidos</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#F2A801" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Produtos Mais Vendidos</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produto</th>
                  <th className="text-right py-2">Vendas</th>
                  <th className="text-right py-2">Receita</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3">{product.name}</td>
                    <td className="text-right py-3">{product.sales}</td>
                    <td className="text-right py-3">{formatCurrency(product.revenue)}</td>
                    <td className="text-right py-3">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
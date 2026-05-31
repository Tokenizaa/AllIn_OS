import React, { useEffect, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseStoreStats } from '@/hooks/useSupabaseStoreStats';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function DashboardCharts() {
  const { storeStats, loading, error } = useSupabaseStoreStats();

  const [revenueData, setRevenueData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    if (storeStats) {
      // Adaptar dados de lojas por número de produtos (simulando receita)
      const adaptedRevenueData = storeStats.slice(0, 6).map((item, index) => ({
        name: `Loja ${index + 1}`,
        value: item.product_count * 50, // Simulação de receita
      }));
      setRevenueData(adaptedRevenueData);

      // Adaptar dados de produtos por loja (simulando produtos mais vendidos)
      const adaptedProductData = storeStats.slice(0, 5).map(item => ({
        name: item.store_name.substring(0, 15) + (item.store_name.length > 15 ? '...' : ''),
        value: item.product_count,
      }));
      setProductData(adaptedProductData);

      // Adaptar dados de lojas por data de criação (simulando evolução de leads)
      const adaptedLeadData = storeStats.slice(0, 6).map((item, index) => ({
        name: `Mês ${index + 1}`,
        leads: item.store_review_count || 0,
      }));
      setLeadData(adaptedLeadData);
    }
  }, [storeStats]);

  if (loading) {
    return <div className="dark:text-allin-white">Carregando dados do dashboard...</div>;
  }

  if (error) {
    return <div className="dark:text-allin-white">Ocorreu um erro ao carregar os dados do dashboard: {error.message}</div>;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Receita */}
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader>
          <CardTitle className="dark:text-allin-white">Receita Mensal</CardTitle>
          <CardDescription className="dark:text-allin-white/70">Receita dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                <Bar dataKey="value" fill="#F2A801" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Produtos */}
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader>
          <CardTitle className="dark:text-allin-white">Produtos Mais Vendidos</CardTitle>
          <CardDescription className="dark:text-allin-white/70">Distribuição de vendas por produto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Vendas']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Leads */}
      <Card className="lg:col-span-2 dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader>
          <CardTitle className="dark:text-allin-white">Evolução de Leads</CardTitle>
          <CardDescription className="dark:text-allin-white/70">Número de leads qualificados por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#F2A801" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
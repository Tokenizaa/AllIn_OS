import React from 'react';

import { TrendingUp, Eye, MousePointerClick, Share2, Mail, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  roi: number;
}

interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha Verão 2023',
    channel: 'Google Ads',
    impressions: 12500,
    clicks: 890,
    conversions: 45,
    cost: 2500,
    roi: 3.2
  },
  {
    id: '2',
    name: 'Email Marketing Junho',
    channel: 'Email',
    impressions: 8500,
    clicks: 1200,
    conversions: 68,
    cost: 500,
    roi: 5.4
  },
  {
    id: '3',
    name: 'Redes Sociais',
    channel: 'Instagram',
    impressions: 22000,
    clicks: 1800,
    conversions: 92,
    cost: 1200,
    roi: 4.1
  },
  {
    id: '4',
    name: 'Influenciadores',
    channel: 'Parcerias',
    impressions: 15000,
    clicks: 950,
    conversions: 58,
    cost: 3000,
    roi: 2.8
  }
];

const trafficSources: TrafficSource[] = [
  { name: 'Direto', value: 35, color: '#F2A801' },
  { name: 'Google', value: 25, color: '#4285F4' },
  { name: 'Facebook', value: 15, color: '#1877F2' },
  { name: 'Instagram', value: 12, color: '#E1306C' },
  { name: 'Email', value: 8, color: '#EA4335' },
  { name: 'Outros', value: 5, color: '#9AA0A6' }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export function MarketingSummary() {
  // Calcular métricas totais
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
  const averageROI = campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length;
  
  const ctr = (totalClicks / totalImpressions) * 100; // Click-Through Rate
  const conversionRate = (totalConversions / totalClicks) * 100;

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Resumo de Marketing
        </CardTitle>
        <CardDescription>
          Métricas e desempenho das campanhas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Impressões</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalImpressions.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 30 dias</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <MousePointerClick className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Cliques</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalClicks.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">CTR: {ctr.toFixed(2)}%</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Share2 className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Conversões</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalConversions}</p>
            <p className="text-xs text-muted-foreground mt-1">Taxa: {conversionRate.toFixed(2)}%</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Custo Total</span>
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">ROI médio: {averageROI.toFixed(2)}</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">ROI Médio</span>
            </div>
            <p className="text-2xl font-bold mt-2">{averageROI.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground mt-1">Retorno sobre investimento</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Desempenho por Campanha</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Campanha</th>
                    <th className="text-left py-2">Canal</th>
                    <th className="text-right py-2">Impressões</th>
                    <th className="text-right py-2">Cliques</th>
                    <th className="text-right py-2">Conversões</th>
                    <th className="text-right py-2">Custo</th>
                    <th className="text-right py-2">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b">
                      <td className="py-3">{campaign.name}</td>
                      <td className="py-3">{campaign.channel}</td>
                      <td className="text-right py-3">{campaign.impressions.toLocaleString('pt-BR')}</td>
                      <td className="text-right py-3">{campaign.clicks.toLocaleString('pt-BR')}</td>
                      <td className="text-right py-3">{campaign.conversions}</td>
                      <td className="text-right py-3">{formatCurrency(campaign.cost)}</td>
                      <td className="text-right py-3">{campaign.roi.toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Fontes de Tráfego</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
          <h4 className="font-medium mb-4">ROI por Campanha</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaigns}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}x`, 'ROI']} />
                <Bar dataKey="roi" fill="#F2A801" name="ROI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
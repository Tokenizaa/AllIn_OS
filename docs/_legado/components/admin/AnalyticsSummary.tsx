import React from 'react';

import { TrendingUp, Users, Eye, MousePointerClick, Clock, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
}

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface PageData {
  page: string;
  views: number;
  avgTime: string;
  exitRate: number;
}

const trafficData: TrafficData[] = [
  { date: 'Jan', visitors: 1200, pageViews: 3400, bounceRate: 32 },
  { date: 'Fev', visitors: 1900, pageViews: 4800, bounceRate: 28 },
  { date: 'Mar', visitors: 1500, pageViews: 4200, bounceRate: 30 },
  { date: 'Abr', visitors: 2200, pageViews: 5600, bounceRate: 25 },
  { date: 'Mai', visitors: 1800, pageViews: 4900, bounceRate: 27 },
  { date: 'Jun', visitors: 2500, pageViews: 6800, bounceRate: 22 }
];

const deviceData: DeviceData[] = [
  { name: 'Desktop', value: 45, color: '#F2A801' },
  { name: 'Mobile', value: 35, color: '#10B981' },
  { name: 'Tablet', value: 20, color: '#3B82F6' }
];

const pageData: PageData[] = [
  { page: '/', views: 12500, avgTime: '2:30', exitRate: 25 },
  { page: '/produtos', views: 8900, avgTime: '3:15', exitRate: 30 },
  { page: '/sobre', views: 6200, avgTime: '1:45', exitRate: 40 },
  { page: '/contato', views: 4800, avgTime: '2:10', exitRate: 35 },
  { page: '/loja', views: 15600, avgTime: '4:20', exitRate: 20 }
];

export function AnalyticsSummary() {
  // Calcular métricas
  const totalVisitors = trafficData.reduce((sum, data) => sum + data.visitors, 0);
  const totalPageViews = trafficData.reduce((sum, data) => sum + data.pageViews, 0);
  const avgBounceRate = trafficData.reduce((sum, data) => sum + data.bounceRate, 0) / trafficData.length;
  const pagesPerSession = totalPageViews / totalVisitors;
  const avgSessionDuration = '3:25'; // Simulado

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Analytics do Site
        </CardTitle>
        <CardDescription>
          Métricas de tráfego e engajamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Visitantes</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalVisitors.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">nos últimos 6 meses</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Page Views</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalPageViews.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-muted-foreground mt-1">visualizações de página</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <MousePointerClick className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Páginas/Sessão</span>
            </div>
            <p className="text-2xl font-bold mt-2">{pagesPerSession.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">médias por visita</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Duração Média</span>
            </div>
            <p className="text-2xl font-bold mt-2">{avgSessionDuration}</p>
            <p className="text-xs text-muted-foreground mt-1">por sessão</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Taxa de Rejeição</span>
            </div>
            <p className="text-2xl font-bold mt-2">{avgBounceRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">páginas vistas uma vez</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tráfego nos últimos 6 meses</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'bounceRate') {
                        return [`${value}%`, 'Taxa de Rejeição'];
                      }
                      return [value.toLocaleString('pt-BR'), name === 'visitors' ? 'Visitantes' : 'Page Views'];
                    }}
                  />
                  <Bar dataKey="visitors" fill="#F2A801" name="Visitantes" />
                  <Bar dataKey="pageViews" fill="#10B981" name="Page Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Dispositivos dos Usuários</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
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
          <h4 className="font-medium mb-4">Páginas Mais Visitadas</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Página</th>
                  <th className="text-right py-2">Visualizações</th>
                  <th className="text-right py-2">Tempo Médio</th>
                  <th className="text-right py-2">Taxa de Saída</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((page, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-mono">{page.page}</td>
                    <td className="text-right py-3">{page.views.toLocaleString('pt-BR')}</td>
                    <td className="text-right py-3">{page.avgTime}</td>
                    <td className="text-right py-3">{page.exitRate}%</td>
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
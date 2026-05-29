import React from 'react';

import { Activity, Zap, Database, Wifi, Server } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ElementType;
}

export function SystemPerformance() {
  const metrics: PerformanceMetric[] = [
    {
      name: 'Uptime',
      value: 99.9,
      unit: '%',
      status: 'good',
      icon: Activity
    },
    {
      name: 'Latência',
      value: 42,
      unit: 'ms',
      status: 'good',
      icon: Zap
    },
    {
      name: 'Uso de CPU',
      value: 24,
      unit: '%',
      status: 'good',
      icon: Server
    },
    {
      name: 'Memória',
      value: 68,
      unit: '%',
      status: 'warning',
      icon: Database
    },
    {
      name: 'Conexão',
      value: 100,
      unit: '%',
      status: 'good',
      icon: Wifi
    }
  ];

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return 'bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Performance do Sistema
        </CardTitle>
        <CardDescription>
          Métricas de desempenho em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center p-4 rounded-lg border ${getStatusBg(metric.status)}`}
              >
                <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold">
                    {metric.value}
                    <span className="text-sm">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.name}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">Detalhes do Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">Servidor</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">AWS EC2 t3.medium</p>
              <p className="text-xs text-muted-foreground mt-1">Localização: São Paulo</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">Banco de Dados</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">PostgreSQL 13.4</p>
              <p className="text-xs text-muted-foreground mt-1">Tamanho: 2.4 GB</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
              <div className="flex items-center">
                <Wifi className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">Conectividade</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">100 Mbps</p>
              <p className="text-xs text-muted-foreground mt-1">Latência: 12ms</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
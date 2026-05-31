import React, { useState, useEffect } from 'react';

import { Users, MessageSquare, ShoppingCart, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardService } from '@/integrations/supabase/services/dashboard';

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    activeConversations: 0,
    pendingOrders: 0,
    conversionRate: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar métricas em tempo real
    const fetchRealTimeMetrics = async () => {
      try {
        const realMetrics = await DashboardService.getRealTimeMetrics();
        setMetrics(realMetrics);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar métricas em tempo real:', error);
        // Em caso de erro, usar valores padrão
        setMetrics({
          activeUsers: 0,
          activeConversations: 0,
          pendingOrders: 0,
          conversionRate: 0
        });
        setLoading(false);
      }
    };

    // Buscar métricas imediatamente
    fetchRealTimeMetrics();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchRealTimeMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Métricas em Tempo Real
          </CardTitle>
          <CardDescription>
            Carregando dados...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Carregando...</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Carregando...</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-orange-50 rounded-lg dark:bg-orange-900/20">
              <ShoppingCart className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Carregando...</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Carregando...</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Métricas em Tempo Real
        </CardTitle>
        <CardDescription>
          Dados atualizados automaticamente a cada 30 segundos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
              <p className="text-2xl font-bold">{metrics.activeUsers}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Conversas Ativas</p>
              <p className="text-2xl font-bold">{metrics.activeConversations}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-orange-50 rounded-lg dark:bg-orange-900/20">
            <ShoppingCart className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</p>
              <p className="text-2xl font-bold">{metrics.pendingOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
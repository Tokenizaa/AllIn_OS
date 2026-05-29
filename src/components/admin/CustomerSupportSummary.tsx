import React, { useState, useEffect } from 'react';

import { Headset, MessageCircle, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupportService, SupportTicket, SupportMetrics } from '@/services/adminContentService';

const getStatusColor = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open': return 'Aberto';
    case 'in_progress': return 'Em Andamento';
    case 'resolved': return 'Resolvido';
    case 'closed': return 'Fechado';
    default: return status;
  }
};

const getPriorityColor = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'low': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'high': return 'text-orange-500';
    case 'urgent': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getPriorityLabel = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    case 'urgent': return 'Urgente';
    default: return priority;
  }
};

export function CustomerSupportSummary() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [metrics, setMetrics] = useState<SupportMetrics[]>([]);
  const [stats, setStats] = useState({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalTickets: 0,
    avgResolutionTime: 0,
    satisfactionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Carregar todos os tickets
        const allTickets = await SupportService.getAllTickets();
        setTickets(allTickets);
        
        // Carregar métricas semanais
        const weeklyMetrics = await SupportService.getWeeklyMetrics();
        setMetrics(weeklyMetrics);
        
        // Carregar estatísticas
        const supportStats = await SupportService.getSupportStats();
        setStats(supportStats);
        
      } catch (error) {
        console.error('Erro ao carregar dados do suporte:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Headset className="h-5 w-5 mr-2" />
            Suporte ao Cliente
          </CardTitle>
          <CardDescription>
            Carregando dados...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-allin-orange"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Headset className="h-5 w-5 mr-2" />
          Suporte ao Cliente
        </CardTitle>
        <CardDescription>
          Métricas e tickets de suporte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Tickets Abertos</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.openTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">aguardando atendimento</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Em Andamento</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.inProgressTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">sendo atendidos</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Resolvidos</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.resolvedTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">nesta semana</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Tempo Médio</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgResolutionTime}m</p>
            <p className="text-xs text-muted-foreground mt-1">de resolução</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Satisfação</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.satisfactionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">dos clientes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tickets nos últimos 7 dias</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#F2A801" name="Tickets Abertos" />
                  <Bar dataKey="resolved" fill="#10B981" name="Tickets Resolvidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tempo Médio de Resposta</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} minutos`, 'Tempo médio']}
                    labelFormatter={(label) => `Dia: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgResponseTime" 
                    stroke="#F2A801" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Tempo Médio (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Tickets Recentes</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Assunto</th>
                  <th className="text-left py-2">Cliente</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Prioridade</th>
                  <th className="text-left py-2">Criado em</th>
                  <th className="text-left py-2">Agente</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b">
                    <td className="py-3">{ticket.subject}</td>
                    <td className="py-3">{ticket.customer_name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </td>
                    <td className="py-3">
                      {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3">
                      {ticket.agent_name || '-'}
                    </td>
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

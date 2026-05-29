import React from 'react';

import { Shield, Key, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'password_change' | 'permission_change' | 'suspicious_activity';
  user: string;
  ip: string;
  location: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'blocked';
}

interface SecurityMetric {
  name: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const securityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    user: 'João Silva',
    ip: '192.168.1.100',
    location: 'São Paulo, BR',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
    status: 'success'
  },
  {
    id: '2',
    type: 'failed_login',
    user: 'admin@allin.com',
    ip: '203.0.113.45',
    location: 'Moscou, RUS',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    status: 'blocked'
  },
  {
    id: '3',
    type: 'password_change',
    user: 'Maria Santos',
    ip: '192.168.1.101',
    location: 'São Paulo, BR',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: 'success'
  },
  {
    id: '4',
    type: 'permission_change',
    user: 'Carlos Oliveira',
    ip: '192.168.1.102',
    location: 'São Paulo, BR',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: 'success'
  },
  {
    id: '5',
    type: 'suspicious_activity',
    user: 'admin@allin.com',
    ip: '198.51.100.23',
    location: 'Nova York, EUA',
    timestamp: new Date(new Date().setHours(new Date().getHours() - 3)),
    status: 'failed'
  }
];

// Esta declaração estava incorreta e foi removida
// Os eventos de segurança estão corretamente definidos em securityEvents
// As métricas de segurança estão corretamente definidas abaixo

const securityMetrics: SecurityMetric[] = [
  {
    name: 'Total de Usuários',
    value: 156,
    icon: Shield,
    color: 'text-blue-500'
  },
  {
    name: 'Logins Bem-sucedidos',
    value: 245,
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    name: 'Logins Bloqueados',
    value: 12,
    icon: XCircle,
    color: 'text-red-500'
  },
  {
    name: 'Atividades Suspeitas',
    value: 3,
    icon: AlertTriangle,
    color: 'text-orange-500'
  },
  {
    name: 'Senhas Alteradas',
    value: 28,
    icon: Key,
    color: 'text-purple-500'
  }
];

const getEventTypeLabel = (type: SecurityEvent['type']) => {
  switch (type) {
    case 'login': return 'Login';
    case 'failed_login': return 'Login Falhou';
    case 'password_change': return 'Senha Alterada';
    case 'permission_change': return 'Permissão Alterada';
    case 'suspicious_activity': return 'Atividade Suspeita';
    default: return type;
  }
};

const getEventTypeColor = (type: SecurityEvent['type']) => {
  switch (type) {
    case 'login': return 'bg-green-100 text-green-800';
    case 'failed_login': return 'bg-red-100 text-red-800';
    case 'password_change': return 'bg-blue-100 text-blue-800';
    case 'permission_change': return 'bg-purple-100 text-purple-800';
    case 'suspicious_activity': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: SecurityEvent['status']) => {
  switch (status) {
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'blocked': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export function SecuritySummary() {
  // Calcular métricas
  const activeSessions = 42;
  const failedLoginsLast24h = securityEvents.filter(
    event => event.type === 'failed_login' && 
    (new Date().getTime() - event.timestamp.getTime()) / (1000 * 60 * 60) <= 24
  ).length;
  
  const suspiciousActivities = securityEvents.filter(
    event => event.type === 'suspicious_activity'
  ).length;

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Segurança do Sistema
        </CardTitle>
        <CardDescription>
          Monitoramento de segurança e eventos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {securityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 ${metric.color} mr-2`} />
                  <span className="font-medium">{metric.name}</span>
                </div>
                <p className="text-2xl font-bold mt-2">{metric.value}</p>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Sessões Ativas</h4>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">{activeSessions}</p>
                <p className="text-sm text-muted-foreground">usuários online</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-500">+5%</p>
                <p className="text-sm text-muted-foreground">em relação a ontem</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Gerenciar Sessões
            </Button>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Tentativas de Login</h4>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">{failedLoginsLast24h}</p>
                <p className="text-sm text-muted-foreground">tentativas falhas nas últimas 24h</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-500">+2</p>
                <p className="text-sm text-muted-foreground">em relação a ontem</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Ver Detalhes
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Eventos de Segurança Recentes</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Evento</th>
                  <th className="text-left py-2">Usuário</th>
                  <th className="text-left py-2">IP</th>
                  <th className="text-left py-2">Localização</th>
                  <th className="text-left py-2">Data/Hora</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {securityEvents.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEventTypeColor(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </td>
                    <td className="py-3">{event.user}</td>
                    <td className="py-3 font-mono text-sm">{event.ip}</td>
                    <td className="py-3">{event.location}</td>
                    <td className="py-3">
                      {event.timestamp.toLocaleDateString('pt-BR')} {event.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      {getStatusIcon(event.status)}
                    </td>
                    <td className="text-right py-3">
                      <Button variant="outline" size="sm">
                        Investigar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
          <h4 className="font-medium mb-3">Recomendações de Segurança</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Todos os administradores devem usar autenticação de dois fatores</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
              <span>3 usuários ainda não alteraram suas senhas padrão</span>
            </li>
            <li className="flex items-start">
              <Eye className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span>Recomenda-se revisar permissões de usuários com acesso total</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
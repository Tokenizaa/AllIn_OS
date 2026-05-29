import React from 'react';

import { 
  Cloud, 
  Database, 
  ShoppingCart, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  Link
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Integration {
  id: string;
  name: string;
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  syncFrequency: string;
  dataTransferred?: number; // em MB
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Banco de Dados Principal',
    service: 'PostgreSQL',
    status: 'connected',
    lastSync: new Date(new Date().setHours(new Date().getHours() - 2)),
    syncFrequency: 'Real-time',
    dataTransferred: 1250
  },
  {
    id: '2',
    name: 'Plataforma de E-commerce',
    service: 'Shopify',
    status: 'connected',
    lastSync: new Date(new Date().setHours(new Date().getHours() - 1)),
    syncFrequency: 'A cada 15 minutos',
    dataTransferred: 450
  },
  {
    id: '3',
    name: 'Serviço de Email',
    service: 'SendGrid',
    status: 'connected',
    lastSync: new Date(new Date().setHours(new Date().getHours() - 3)),
    syncFrequency: 'A cada hora',
    dataTransferred: 50
  },
  {
    id: '4',
    name: 'Plataforma de Chat',
    service: 'WhatsApp Business',
    status: 'error',
    lastSync: new Date(new Date().setDate(new Date().getDate() - 1)),
    syncFrequency: 'A cada 5 minutos',
    dataTransferred: 200
  },
  {
    id: '5',
    name: 'Analytics',
    service: 'Google Analytics',
    status: 'connected',
    lastSync: new Date(new Date().setHours(new Date().getHours() - 4)),
    syncFrequency: 'Diário',
    dataTransferred: 5
  },
  {
    id: '6',
    name: 'Sistema de Pagamento',
    service: 'Stripe',
    status: 'disconnected',
    syncFrequency: 'N/A',
    dataTransferred: 0
  }
];

const getStatusIcon = (status: Integration['status']) => {
  switch (status) {
    case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'disconnected': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'error': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: Integration['status']) => {
  switch (status) {
    case 'connected': return 'bg-green-100 text-green-800';
    case 'disconnected': return 'bg-red-100 text-red00';
    case 'error': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: Integration['status']) => {
  switch (status) {
    case 'connected': return 'Conectado';
    case 'disconnected': return 'Desconectado';
    case 'error': return 'Erro';
    default: return status;
  }
};

export function IntegrationsSummary() {
  // Calcular métricas
  const connectedIntegrations = integrations.filter(int => int.status === 'connected').length;
  const totalIntegrations = integrations.length;
  const disconnectedIntegrations = integrations.filter(int => int.status === 'disconnected').length;
  const errorIntegrations = integrations.filter(int => int.status === 'error').length;
  
  const totalDataTransferred = integrations
    .filter(int => int.dataTransferred)
    .reduce((sum, int) => sum + (int.dataTransferred || 0), 0);
  
  const avgDataPerIntegration = connectedIntegrations > 0 ? 
    (totalDataTransferred / connectedIntegrations).toFixed(1) : '0';

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Integrações do Sistema
        </CardTitle>
        <CardDescription>
          Conexões com serviços externos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Link className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Total de Integrações</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalIntegrations}</p>
            <p className="text-xs text-muted-foreground mt-1">serviços conectados</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Conectadas</span>
            </div>
            <p className="text-2xl font-bold mt-2">{connectedIntegrations}</p>
            <p className="text-xs text-muted-foreground mt-1">funcionando normalmente</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Desconectadas</span>
            </div>
            <p className="text-2xl font-bold mt-2">{disconnectedIntegrations}</p>
            <p className="text-xs text-muted-foreground mt-1">não configuradas</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Com Erros</span>
            </div>
            <p className="text-2xl font-bold mt-2">{errorIntegrations}</p>
            <p className="text-xs text-muted-foreground mt-1">necessitam atenção</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Dados Transferidos</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalDataTransferred} MB</p>
            <p className="text-xs text-muted-foreground mt-1">média: {avgDataPerIntegration} MB</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-4">Status das Integrações</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Integração</th>
                  <th className="text-left py-2">Serviço</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Última Sincronização</th>
                  <th className="text-left py-2">Frequência</th>
                  <th className="text-left py-2">Dados Transferidos</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.id} className="border-b">
                    <td className="py-3">{integration.name}</td>
                    <td className="py-3">{integration.service}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {getStatusIcon(integration.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(integration.status)}`}>
                          {getStatusLabel(integration.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {integration.lastSync ? 
                        `${integration.lastSync.toLocaleDateString('pt-BR')  } ${  
                        integration.lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 
                        '-'}
                    </td>
                    <td className="py-3">{integration.syncFrequency}</td>
                    <td className="py-3">
                      {integration.dataTransferred ? `${integration.dataTransferred} MB` : '-'}
                    </td>
                    <td className="text-right py-3">
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-3">Integrações Críticas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Banco de Dados</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 text-green-500 mr-2" />
                  <span>E-commerce</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-red-500 mr-2" />
                  <span>Serviço de Email</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-3">Integrações com Problemas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-orange-500 mr-2" />
                  <span>Chat WhatsApp</span>
                </div>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-red-500 mr-2" />
                  <span>Sistema de Pagamento</span>
                </div>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-3">Recomendações</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                <span>Verificar conexão com WhatsApp Business</span>
              </li>
              <li className="flex items-start">
                <Cloud className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Configurar integração com Stripe</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span>Backup automático das integrações ativas</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
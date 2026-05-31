import React from 'react';

import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Settings
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'completed';
  lastRun?: Date;
  nextRun?: Date;
  runs: number;
  successRate: number;
  createdBy: string;
}

const automations: Automation[] = [
  {
    id: '1',
    name: 'Atualização de Estoque',
    description: 'Sincroniza estoque com fornecedores a cada 2 horas',
    status: 'active',
    lastRun: new Date(new Date().setHours(new Date().getHours() - 1)),
    nextRun: new Date(new Date().setHours(new Date().getHours() + 1)),
    runs: 124,
    successRate: 98.5,
    createdBy: 'Sistema'
  },
  {
    id: '2',
    name: 'Envio de Relatórios',
    description: 'Envia relatório diário de vendas para o time de marketing',
    status: 'active',
    lastRun: new Date(new Date().setDate(new Date().getDate() - 1)),
    nextRun: new Date(new Date().setDate(new Date().getDate() + 1)),
    runs: 30,
    successRate: 100,
    createdBy: 'Maria Santos'
  },
  {
    id: '3',
    name: 'Backup Automático',
    description: 'Realiza backup completo do sistema todas as noites',
    status: 'paused',
    lastRun: new Date(new Date().setDate(new Date().getDate() - 1)),
    nextRun: undefined,
    runs: 45,
    successRate: 95.6,
    createdBy: 'Sistema'
  },
  {
    id: '4',
    name: 'Limpeza de Dados',
    description: 'Remove dados antigos do sistema a cada semana',
    status: 'error',
    lastRun: new Date(new Date().setDate(new Date().getDate() - 7)),
    nextRun: undefined,
    runs: 12,
    successRate: 75.0,
    createdBy: 'Carlos Oliveira'
  },
  {
    id: '5',
    name: 'Notificação de Leads',
    description: 'Envia notificação para equipe de vendas quando novo lead é qualificado',
    status: 'active',
    lastRun: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    nextRun: undefined,
    runs: 210,
    successRate: 99.0,
    createdBy: 'Sistema'
  }
];

const getStatusIcon = (status: Automation['status']) => {
  switch (status) {
    case 'active': return <Play className="h-4 w-4 text-green-500" />;
    case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
    case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
    default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: Automation['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'error': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: Automation['status']) => {
  switch (status) {
    case 'active': return 'Ativa';
    case 'paused': return 'Pausada';
    case 'error': return 'Erro';
    case 'completed': return 'Concluída';
    default: return status;
  }
};

export function AutomationsSummary() {
  // Calcular métricas
  const activeAutomations = automations.filter(auto => auto.status === 'active').length;
  const totalAutomations = automations.length;
  const pausedAutomations = automations.filter(auto => auto.status === 'paused').length;
  const errorAutomations = automations.filter(auto => auto.status === 'error').length;
  
  const totalRuns = automations.reduce((sum, auto) => sum + auto.runs, 0);
  const avgSuccessRate = automations.reduce((sum, auto) => sum + auto.successRate, 0) / automations.length;

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Automações do Sistema
        </CardTitle>
        <CardDescription>
          Processos automatizados e seus status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Total de Automações</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">processos configurados</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Play className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Ativas</span>
            </div>
            <p className="text-2xl font-bold mt-2">{activeAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">em execução</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Pause className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium">Pausadas</span>
            </div>
            <p className="text-2xl font-bold mt-2">{pausedAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">temporariamente desativadas</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Com Erros</span>
            </div>
            <p className="text-2xl font-bold mt-2">{errorAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">necessitam correção</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Taxa de Sucesso</span>
            </div>
            <p className="text-2xl font-bold mt-2">{avgSuccessRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">média de todas as automações</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Automações Configuradas</h4>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Automação</th>
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Última Execução</th>
                  <th className="text-left py-2">Próxima Execução</th>
                  <th className="text-left py-2">Execuções</th>
                  <th className="text-left py-2">Taxa de Sucesso</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((automation) => (
                  <tr key={automation.id} className="border-b">
                    <td className="py-3 font-medium">{automation.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{automation.description}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {getStatusIcon(automation.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(automation.status)}`}>
                          {getStatusLabel(automation.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {automation.lastRun ? 
                        `${automation.lastRun.toLocaleDateString('pt-BR')  } ${  
                        automation.lastRun.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 
                        '-'}
                    </td>
                    <td className="py-3">
                      {automation.nextRun ? 
                        `${automation.nextRun.toLocaleDateString('pt-BR')  } ${  
                        automation.nextRun.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 
                        '-'}
                    </td>
                    <td className="py-3">{automation.runs}</td>
                    <td className="py-3">{automation.successRate.toFixed(1)}%</td>
                    <td className="text-right py-3">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Desempenho das Automações</h4>
            <div className="space-y-4">
              {automations
                .sort((a, b) => b.runs - a.runs)
                .slice(0, 3)
                .map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-sm">{automation.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        {automation.runs} execuções
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{automation.successRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">sucesso</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Recomendações</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Corrigir automação "Limpeza de Dados"</p>
                  <p className="text-xs text-muted-foreground">Última execução com erro há 7 dias</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Agendar backup noturno</p>
                  <p className="text-xs text-muted-foreground">Recomendado para manutenção do sistema</p>
                </div>
              </li>
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Otimizar automações ativas</p>
                  <p className="text-xs text-muted-foreground">Reduzir consumo de recursos em 15%</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
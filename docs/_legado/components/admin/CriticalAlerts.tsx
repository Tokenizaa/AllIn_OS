import React from 'react';

import { AlertTriangle, XCircle, WifiOff, Database } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CriticalAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action?: string;
  timestamp: string;
}

const alerts: CriticalAlert[] = [
  {
    id: '1',
    type: 'error',
    title: 'Erro no servidor',
    description: 'O servidor de banco de dados está indisponível. Alguns recursos podem não funcionar corretamente.',
    severity: 'critical',
    action: 'Ver logs',
    timestamp: 'há 10 minutos'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Backup pendente',
    description: 'O último backup automático falhou. Recomenda-se realizar um backup manual imediatamente.',
    severity: 'high',
    action: 'Fazer backup',
    timestamp: 'há 1 hora'
  },
  {
    id: '3',
    type: 'info',
    title: 'Atualização disponível',
    description: 'Uma nova versão do sistema está disponível para instalação.',
    severity: 'medium',
    action: 'Atualizar',
    timestamp: 'há 3 horas'
  }
];

const getIcon = (type: CriticalAlert['type']) => {
  switch (type) {
    case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info': return <Database className="h-5 w-5 text-blue-500" />;
    default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

const getSeverityColor = (severity: CriticalAlert['severity']) => {
  switch (severity) {
    case 'low': return 'border-green-500 bg-green-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'high': return 'border-orange-500 bg-orange-50';
    case 'critical': return 'border-red-500 bg-red-50';
    default: return 'border-gray-500 bg-gray-50';
  }
};

export function CriticalAlerts() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Alertas Críticos
        </CardTitle>
        <CardDescription>
          Problemas que requerem atenção imediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`flex items-start p-4 rounded-lg border ${getSeverityColor(alert.severity)} dark:bg-opacity-10`}
            >
              <div className="mt-0.5">
                {getIcon(alert.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.description}
                </p>
                {alert.action && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      {alert.action}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
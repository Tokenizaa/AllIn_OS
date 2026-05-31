import React from 'react';

import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Estoque baixo',
    description: '3 produtos estão com estoque abaixo de 10 unidades',
    time: 'há 2 horas',
    unread: true
  },
  {
    id: '2',
    type: 'info',
    title: 'Novo lead qualificado',
    description: 'Um novo lead com score alto foi identificado',
    time: 'há 5 horas',
    unread: true
  },
  {
    id: '3',
    type: 'success',
    title: 'Backup realizado',
    description: 'Backup automático do sistema concluído com sucesso',
    time: 'ontem',
    unread: false
  },
  {
    id: '4',
    type: 'error',
    title: 'Erro no sistema',
    description: 'Falha ao processar 2 pedidos - verifique o log de erros',
    time: 'ontem',
    unread: false
  }
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getColor = (type: Notification['type']) => {
  switch (type) {
    case 'info': return 'bg-blue-100 border-blue-500';
    case 'warning': return 'bg-yellow-100 border-yellow-500';
    case 'success': return 'bg-green-100 border-green-500';
    case 'error': return 'bg-red-100 border-red-500';
    default: return 'bg-gray-100 border-gray-500';
  }
};

export function Notifications() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notificações
        </CardTitle>
        <CardDescription>
          Alertas e informações importantes do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-start p-4 rounded-lg border ${getColor(notification.type)} ${notification.unread ? 'bg-opacity-50' : 'bg-opacity-20'}`}
            >
              <div className="mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
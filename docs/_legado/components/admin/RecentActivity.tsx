import React from 'react';

import { Users, Package, MessageSquare, UserPlus, ShoppingCart, Edit3 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: string;
  type: 'user' | 'product' | 'conversation' | 'lead' | 'order' | 'edit';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'user',
    title: 'Novo usuário cadastrado',
    description: 'João Silva se cadastrou no sistema',
    time: 'há 5 minutos',
    user: 'João Silva'
  },
  {
    id: '2',
    type: 'product',
    title: 'Produto adicionado',
    description: 'Novo tênis esportivo adicionado ao catálogo',
    time: 'há 15 minutos',
    user: 'Maria Santos'
  },
  {
    id: '3',
    type: 'conversation',
    title: 'Nova conversa no chat',
    description: 'Lead iniciou conversa sobre produtos',
    time: 'há 30 minutos',
    user: 'Carlos Oliveira'
  },
  {
    id: '4',
    type: 'lead',
    title: 'Novo lead qualificado',
    description: 'Lead com score alto identificado',
    time: 'há 1 hora',
    user: 'Ana Costa'
  },
  {
    id: '5',
    type: 'edit',
    title: 'Produto atualizado',
    description: 'Informações do tênis esportivo foram atualizadas',
    time: 'há 2 horas',
    user: 'Pedro Almeida'
  }
];

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'user': return <UserPlus className="h-4 w-4 text-blue-500" />;
    case 'product': return <Package className="h-4 w-4 text-green-500" />;
    case 'conversation': return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'lead': return <Users className="h-4 w-4 text-orange-500" />;
    case 'order': return <ShoppingCart className="h-4 w-4 text-teal-500" />;
    case 'edit': return <Edit3 className="h-4 w-4 text-yellow-500" />;
    default: return <Edit3 className="h-4 w-4 text-gray-500" />;
  }
};

const getColor = (type: Activity['type']) => {
  switch (type) {
    case 'user': return 'bg-blue-100';
    case 'product': return 'bg-green-100';
    case 'conversation': return 'bg-purple-100';
    case 'lead': return 'bg-orange-100';
    case 'order': return 'bg-teal-100';
    case 'edit': return 'bg-yellow-100';
    default: return 'bg-gray-100';
  }
};

export function RecentActivity() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Últimas ações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className={`flex items-center justify-center p-2 rounded-full ${getColor(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                {activity.user && (
                  <p className="text-xs text-muted-foreground">
                    por {activity.user}
                  </p>
                )}
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
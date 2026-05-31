import React from 'react';

import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  assignee?: string;
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Atualizar catálogo de produtos',
    description: 'Adicionar novos produtos e atualizar preços',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    assignee: 'Maria Santos'
  },
  {
    id: '2',
    title: 'Revisar leads qualificados',
    description: 'Analisar leads com score acima de 80',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    assignee: 'João Silva'
  },
  {
    id: '3',
    title: 'Preparar relatório mensal',
    description: 'Compilar dados de vendas e performance',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    assignee: 'Ana Costa'
  },
  {
    id: '4',
    title: 'Configurar novo usuário admin',
    description: 'Criar conta e definir permissões para novo administrador',
    priority: 'low',
    status: 'completed',
    assignee: 'Pedro Almeida'
  }
];

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'low': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'high': return 'text-orange-500';
    case 'urgent': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'pending': return <Circle className="h-4 w-4 text-gray-400" />;
    case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    default: return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusText = (status: Task['status']) => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'in_progress': return 'Em andamento';
    case 'completed': return 'Concluído';
    default: return 'Pendente';
  }
};

export function PendingTasks() {
  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Tarefas Pendentes
        </CardTitle>
        <CardDescription>
          Tarefas que precisam ser concluídas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pendingTasks.length > 0 ? (
            <div>
              <h3 className="font-medium mb-3">Tarefas Pendentes ({pendingTasks.length})</h3>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
                    <div className="mr-3">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'low' && 'Baixa'}
                          {task.priority === 'medium' && 'Média'}
                          {task.priority === 'high' && 'Alta'}
                          {task.priority === 'urgent' && 'Urgente'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Vencimento: {task.dueDate.toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {task.assignee && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Responsável: {task.assignee}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="ml-3">
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">Todas as tarefas foram concluídas!</p>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Tarefas Concluídas ({completedTasks.length})</h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center p-3 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 opacity-75">
                    <div className="mr-3">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm line-through">{task.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-through">
                        {task.description}
                      </p>
                      {task.assignee && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Concluído por: {task.assignee}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
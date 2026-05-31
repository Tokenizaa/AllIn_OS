import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestType: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminRequestDetailsProps {
  request: AdminRequest;
  onBack: () => void;
  onEdit: () => void;
}

export function AdminRequestDetails({ request, onBack, onEdit }: AdminRequestDetailsProps) {
  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'access_request': return 'Solicitação de Acesso';
      case 'permission_change': return 'Alteração de Permissão';
      case 'account_issue': return 'Problema com Conta';
      case 'feature_request': return 'Solicitação de Funcionalidade';
      case 'bug_report': return 'Relatório de Bug';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'rejected': return 'Rejeitado';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes da Solicitação</h1>
        <Button variant="vibrantOutline" onClick={onBack}>Voltar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Solicitação</CardTitle>
          <CardDescription>
            Detalhes completos da solicitação de administração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="mt-1 text-sm text-gray-900">{request.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Criação</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleDateString('pt-BR')} às {new Date(request.createdAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Última Atualização</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(request.updatedAt).toLocaleDateString('pt-BR')} às {new Date(request.updatedAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridade</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getPriorityColor(request.priority)}`}>
                {getPriorityLabel(request.priority)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-sm text-gray-900">{request.userName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{request.userEmail}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">ID do Usuário</label>
              <p className="mt-1 text-sm text-gray-900">{request.userId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Solicitação</label>
            <p className="mt-1 text-sm text-gray-900">{getRequestTypeLabel(request.requestType)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{request.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="vibrant" onClick={onEdit}>
          Editar Solicitação
        </Button>
      </div>
    </div>
  );
}
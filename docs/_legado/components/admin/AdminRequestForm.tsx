import React, { useState, useEffect } from 'react';

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

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

interface AdminRequestFormProps {
  request?: AdminRequest | null;
  onSave: (request: AdminRequest) => void;
  onCancel: () => void;
}

export function AdminRequestForm({ request, onSave, onCancel }: AdminRequestFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    requestType: 'access_request',
    description: '',
    status: 'pending',
    priority: 'medium'
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError, clearError, error } = useErrorHandler();

  // Preencher formulário quando editando
  useEffect(() => {
    if (request) {
      setFormData({
        userId: request.userId || '',
        userName: request.userName || '',
        userEmail: request.userEmail || '',
        requestType: request.requestType || 'access_request',
        description: request.description || '',
        status: request.status || 'pending',
        priority: request.priority || 'medium'
      });
    }
  }, [request]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome do usuário é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.userEmail.trim()) {
      toast({
        title: "Erro de validação",
        description: "Email do usuário é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Erro de validação",
        description: "Descrição da solicitação é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      const requestData = {
        id: request?.id || crypto.randomUUID(),
        userId: formData.userId || crypto.randomUUID(),
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim(),
        requestType: formData.requestType,
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        createdAt: request?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      toast({
        title: "Sucesso",
        description: request ? "Solicitação atualizada com sucesso!" : "Solicitação criada com sucesso!"
      });

      onSave(requestData);
    } catch (error) {
      handleError(error);
      toast({
        title: "Erro",
        description: error?.message || "Falha ao salvar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Usuário */}
        <div>
          <Label htmlFor="userName">Nome do Usuário *</Label>
          <Input
            id="userName"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="Digite o nome do usuário"
            required
          />
        </div>

        {/* Email do Usuário */}
        <div>
          <Label htmlFor="userEmail">Email do Usuário *</Label>
          <Input
            id="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={(e) => handleInputChange('userEmail', e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        {/* Tipo de Solicitação */}
        <div>
          <Label htmlFor="requestType">Tipo de Solicitação</Label>
          <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="access_request">Solicitação de Acesso</SelectItem>
              <SelectItem value="permission_change">Alteração de Permissão</SelectItem>
              <SelectItem value="account_issue">Problema com Conta</SelectItem>
              <SelectItem value="feature_request">Solicitação de Funcionalidade</SelectItem>
              <SelectItem value="bug_report">Relatório de Bug</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prioridade */}
        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva detalhadamente a solicitação"
            rows={6}
            required
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="vibrant"
          type="submit"
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {request ? 'Atualizar Solicitação' : 'Criar Solicitação'}
        </Button>
      </div>
    </form>
  );
}
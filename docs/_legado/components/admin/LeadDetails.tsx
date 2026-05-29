import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  source: string;
  notes: string | null;
  createdAt: string;
}

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  onEdit: () => void;
}

export function LeadDetails({ lead, onBack, onEdit }: LeadDetailsProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'contacted': return 'Contactado';
      case 'qualified': return 'Qualificado';
      case 'lost': return 'Perdido';
      case 'converted': return 'Convertido';
      default: return status;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'website': return 'Website';
      case 'social_media': return 'Redes Sociais';
      case 'referral': return 'Indicação';
      case 'event': return 'Evento';
      case 'other': return 'Outro';
      default: return source;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-indigo-100 text-indigo-800';
      case 'social_media': return 'bg-pink-100 text-pink-800';
      case 'referral': return 'bg-teal-100 text-teal-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes do Lead</h1>
        <Button variant="vibrantOutline" onClick={onBack}>Voltar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Lead</CardTitle>
          <CardDescription>
            Detalhes completos do lead
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="mt-1 text-sm text-gray-900">{lead.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Criação</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-sm text-gray-900">{lead.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(lead.status)}`}>
                {getStatusLabel(lead.status)}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{lead.email || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <p className="mt-1 text-sm text-gray-900">{lead.phone || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fonte</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getSourceColor(lead.source)}`}>
                {getSourceLabel(lead.source)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {lead.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="vibrant" onClick={onEdit}>
          Editar Lead
        </Button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

import { Search, Phone, User, Calendar, TrendingUp, Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LeadService, ConversationService } from '@/services/leadServiceNew';

interface Lead {
  id: string;
  name?: string;
  whatsapp?: string;
  email?: string;
  source: 'webchat' | 'whatsapp' | 'instagram';
  channel: string;
  intent?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assigned_agent_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface Conversation {
  id: string;
  lead_id?: string;
  user_name?: string;
  user_whatsapp?: string;
  conversation_stage?: string;
  lead_score?: number;
  status: 'active' | 'inactive' | 'escalated' | 'closed';
  assigned_agent_id?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
    fetchConversations();
  }, []);

  const fetchLeads = async () => {
    try {
      const leadsData = await LeadService.getLeads();
      setLeads(leadsData);
    } catch (error: any) {
      console.error('Erro ao buscar leads:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar leads",
        variant: "destructive"
      });
    }
  };

  const fetchConversations = async () => {
    try {
      const conversationsData = await ConversationService.getConversations();
      setConversations(conversationsData);
    } catch (error: any) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.whatsapp?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getLeadScore = (leadId: string): number => {
    const leadConversations = conversations.filter(conv => conv.lead_id === leadId);
    if (leadConversations.length === 0) return 0;
    
    return leadConversations.reduce((sum, conv) => sum + (conv.lead_score || 0), 0) / leadConversations.length;
  };

  const getConversationCount = (leadId: string): number => {
    return conversations.filter(conv => conv.lead_id === leadId).length;
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 70) return 'default'; // Verde
    if (score >= 40) return 'secondary'; // Amarelo
    return 'destructive'; // Vermelho
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'default';
      case 'converted': return 'default';
      case 'lost': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'contacted': return 'Contatado';
      case 'qualified': return 'Qualificado';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-allin-white">Leads</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="contacted">Contatados</SelectItem>
              <SelectItem value="qualified">Qualificados</SelectItem>
              <SelectItem value="converted">Convertidos</SelectItem>
              <SelectItem value="lost">Perdidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contatados</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'contacted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Qualificados</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'qualified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Convertidos</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'converted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>
            Gerencie todos os leads capturados pelo sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Contato</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Conversas</th>
                  <th className="text-left py-3 px-4">Origem</th>
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50 dark:hover:bg-allin-bg-dark-2">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{lead.name || 'Sem nome'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{lead.whatsapp || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(lead.status)}>
                        {getStatusLabel(lead.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getScoreBadgeVariant(getLeadScore(lead.id))}>
                        {Math.round(getLeadScore(lead.id))}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{getConversationCount(lead.id)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          lead.source === 'webchat' ? 'bg-blue-500' :
                          lead.source === 'whatsapp' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`} />
                        <span className="text-sm capitalize">{lead.source}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Nenhum lead encontrado para esta busca.' : 'Nenhum lead encontrado.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;

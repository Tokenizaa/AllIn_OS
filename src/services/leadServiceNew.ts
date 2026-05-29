// NOVO SERVIÇO: LeadService para substituir localStorage
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
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

export interface Conversation {
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

export class LeadService {
  /**
   * Criar um novo lead
   */
  static async createLead(leadData: Partial<Lead>): Promise<Lead> {
    try {
      const newLead = {
        name: leadData.name,
        whatsapp: leadData.whatsapp,
        email: leadData.email || `${leadData.whatsapp}@temp.com`,
        source: leadData.source || 'webchat',
        channel: leadData.channel || 'webchat',
        intent: leadData.intent,
        status: leadData.status || 'new',
        assigned_agent_id: leadData.assigned_agent_id,
        metadata: leadData.metadata || {},
        imported_from_localstorage: false
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar lead:', error);
        throw new Error(`Falha ao criar lead: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em LeadService.createLead:', error);
      throw error;
    }
  }

  /**
   * Obter todos os leads
   */
  static async getLeads(filters?: {
    status?: string;
    source?: string;
    limit?: number;
    offset?: number;
  }): Promise<Lead[]> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.source) {
        query = query.eq('source', filters.source);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar leads:', error);
        throw new Error(`Falha ao buscar leads: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em LeadService.getLeads:', error);
      throw error;
    }
  }

  /**
   * Obter lead por ID
   */
  static async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro em LeadService.getLeadById:', error);
      return null;
    }
  }

  /**
   * Atualizar lead
   */
  static async updateLead(id: string, updateData: Partial<Lead>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar lead:', error);
        throw new Error(`Falha ao atualizar lead: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em LeadService.updateLead:', error);
      throw error;
    }
  }

  /**
   * Deletar lead
   */
  static async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar lead:', error);
        throw new Error(`Falha ao deletar lead: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Erro em LeadService.deleteLead:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de leads
   */
  static async getLeadStats(): Promise<{
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    leadsBySource: Record<string, number>;
    leadsByStatus: Record<string, number>;
  }> {
    try {
      // Total de leads
      const { count: totalLeads, error: totalError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Leads por status
      const { data: statusData, error: statusError } = await supabase
        .from('leads')
        .select('status');

      if (statusError) throw statusError;

      const leadsByStatus = (statusData || []).reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Leads por source
      const { data: sourceData, error: sourceError } = await supabase
        .from('leads')
        .select('source');

      if (sourceError) throw sourceError;

      const leadsBySource = (sourceData || []).reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalLeads: totalLeads || 0,
        newLeads: leadsByStatus['new'] || 0,
        contactedLeads: leadsByStatus['contacted'] || 0,
        qualifiedLeads: leadsByStatus['qualified'] || 0,
        convertedLeads: leadsByStatus['converted'] || 0,
        leadsBySource,
        leadsByStatus
      };
    } catch (error) {
      console.error('Erro em LeadService.getLeadStats:', error);
      return {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        leadsBySource: {},
        leadsByStatus: {}
      };
    }
  }

  /**
   * Buscar leads por termo
   */
  static async searchLeads(searchTerm: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,whatsapp.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads:', error);
        throw new Error(`Falha ao buscar leads: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em LeadService.searchLeads:', error);
      throw error;
    }
  }
}

export class ConversationService {
  /**
   * Criar uma nova conversa
   */
  static async createConversation(conversationData: Partial<Conversation>): Promise<Conversation> {
    try {
      const newConversation = {
        lead_id: conversationData.lead_id,
        user_name: conversationData.user_name,
        user_whatsapp: conversationData.user_whatsapp,
        conversation_stage: conversationData.conversation_stage || 'initial',
        lead_score: conversationData.lead_score || 0,
        status: conversationData.status || 'active',
        assigned_agent_id: conversationData.assigned_agent_id,
        priority: conversationData.priority || 'normal',
        metadata: conversationData.metadata || {},
        imported_from_localstorage: false
      };

      const { data, error } = await supabase
        .from('conversas')
        .insert([newConversation])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar conversa:', error);
        throw new Error(`Falha ao criar conversa: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em ConversationService.createConversation:', error);
      throw error;
    }
  }

  /**
   * Obter todas as conversas
   */
  static async getConversations(filters?: {
    status?: string;
    lead_id?: string;
    limit?: number;
  }): Promise<Conversation[]> {
    try {
      let query = supabase
        .from('conversas')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.lead_id) {
        query = query.eq('lead_id', filters.lead_id);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar conversas:', error);
        throw new Error(`Falha ao buscar conversas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em ConversationService.getConversations:', error);
      throw error;
    }
  }

  /**
   * Atualizar conversa
   */
  static async updateConversation(id: string, updateData: Partial<Conversation>): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversas')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar conversa:', error);
        throw new Error(`Falha ao atualizar conversa: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em ConversationService.updateConversation:', error);
      throw error;
    }
  }

  /**
   * Obter conversas por lead
   */
  static async getConversationsByLead(leadId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversas')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar conversas do lead:', error);
        throw new Error(`Falha ao buscar conversas do lead: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em ConversationService.getConversationsByLead:', error);
      throw error;
    }
  }
}

// Script de migração do localStorage para Supabase
export const migrateLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando migração do localStorage para Supabase...');

    // Migrar leads
    const localLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    console.log(`📊 Encontrados ${localLeads.length} leads no localStorage`);

    for (const lead of localLeads) {
      try {
        await LeadService.createLead({
          name: lead.name,
          whatsapp: lead.whatsapp,
          email: `${lead.whatsapp}@temp.com`,
          source: 'webchat',
          channel: 'webchat',
          metadata: {
            imported_from_localstorage: true,
            original_data: lead,
            created_at: lead.createdAt
          }
        });
      } catch (error) {
        console.error(`❌ Erro ao migrar lead ${lead.id}:`, error);
      }
    }

    // Migrar conversas
    const localConversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
    console.log(`💬 Encontradas ${localConversations.length} conversas no localStorage`);

    for (const conv of localConversations) {
      try {
        await ConversationService.createConversation({
          lead_id: conv.lead_id,
          user_name: conv.user_name,
          user_whatsapp: conv.user_whatsapp,
          conversation_stage: conv.conversation_stage,
          lead_score: conv.lead_score,
          status: conv.status || 'active',
          metadata: {
            imported_from_localstorage: true,
            original_data: conv,
            created_at: conv.created_at
          }
        });
      } catch (error) {
        console.error(`❌ Erro ao migrar conversa ${conv.id}:`, error);
      }
    }

    // Limpar localStorage após migração bem-sucedida
    localStorage.removeItem('leads');
    localStorage.removeItem('chatConversations');
    
    console.log('✅ Migração concluída com sucesso!');
    console.log('🧹 LocalStorage limpo');
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    throw error;
  }
};

// Função para verificar se há dados no localStorage
export const hasLocalStorageData = (): boolean => {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  const conversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
  return leads.length > 0 || conversations.length > 0;
};

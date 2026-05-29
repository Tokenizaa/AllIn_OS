// CONTENT SERVICE - Substituir dados mockados do ContentSummary
import { supabase } from '@/integrations/supabase/client';

export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'image' | 'video' | 'blog';
  status: 'draft' | 'published' | 'scheduled';
  views?: number;
  author: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export class ContentService {
  /**
   * Criar novo conteúdo
   */
  static async createContent(contentData: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const newContent = {
        title: contentData.title,
        type: contentData.type,
        status: contentData.status || 'draft',
        views: contentData.views || 0,
        author: contentData.author,
        content: contentData.content,
        image_url: contentData.image_url,
        video_url: contentData.video_url,
        published_at: contentData.published_at
      };

      const { data, error } = await supabase
        .from('content_management')
        .insert([newContent])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar conteúdo:', error);
        throw new Error(`Falha ao criar conteúdo: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em ContentService.createContent:', error);
      throw error;
    }
  }

  /**
   * Obter todos os conteúdos
   */
  static async getAllContents(filters?: {
    type?: string;
    status?: string;
    limit?: number;
  }): Promise<ContentItem[]> {
    try {
      let query = supabase
        .from('content_management')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar conteúdos:', error);
        throw new Error(`Falha ao buscar conteúdos: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em ContentService.getAllContents:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de conteúdo
   */
  static async getContentStats(): Promise<{
    totalContent: number;
    publishedContent: number;
    draftContent: number;
    scheduledContent: number;
    totalViews: number;
    avgViewsPerContent: number;
    contentByType: Record<string, number>;
  }> {
    try {
      // Total de conteúdos
      const { count: totalContent, error: totalError } = await supabase
        .from('content_management')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Conteúdos por status
      const { data: statusData, error: statusError } = await supabase
        .from('content_management')
        .select('status, views');

      if (statusError) throw statusError;

      const statusCounts = (statusData || []).reduce((acc, content) => {
        acc[content.status] = (acc[content.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Conteúdos por tipo
      const { data: typeData, error: typeError } = await supabase
        .from('content_management')
        .select('type');

      if (typeError) throw typeError;

      const contentByType = (typeData || []).reduce((acc, content) => {
        acc[content.type] = (acc[content.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Total de visualizações
      const totalViews = (statusData || []).reduce((sum, content) => sum + (content.views || 0), 0);
      
      const publishedContent = statusCounts['published'] || 0;
      const avgViewsPerContent = publishedContent > 0 ? Math.round(totalViews / publishedContent) : 0;

      return {
        totalContent: totalContent || 0,
        publishedContent,
        draftContent: statusCounts['draft'] || 0,
        scheduledContent: statusCounts['scheduled'] || 0,
        totalViews,
        avgViewsPerContent,
        contentByType
      };
    } catch (error) {
      console.error('Erro em ContentService.getContentStats:', error);
      return {
        totalContent: 0,
        publishedContent: 0,
        draftContent: 0,
        scheduledContent: 0,
        totalViews: 0,
        avgViewsPerContent: 0,
        contentByType: {}
      };
    }
  }

  /**
   * Obter conteúdos populares
   */
  static async getPopularContents(limit: number = 3): Promise<ContentItem[]> {
    try {
      const { data, error } = await supabase
        .from('content_management')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar conteúdos populares:', error);
        throw new Error(`Falha ao buscar conteúdos populares: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em ContentService.getPopularContents:', error);
      throw error;
    }
  }

  /**
   * Atualizar conteúdo
   */
  static async updateContent(id: string, updateData: Partial<ContentItem>): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_management')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar conteúdo:', error);
        throw new Error(`Falha ao atualizar conteúdo: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em ContentService.updateContent:', error);
      throw error;
    }
  }

  /**
   * Incrementar visualizações
   */
  static async incrementViews(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_content_views', { content_id: id });
      
      if (error) {
        console.error('Erro ao incrementar visualizações:', error);
        throw new Error(`Falha ao incrementar visualizações: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro em ContentService.incrementViews:', error);
      throw error;
    }
  }
}

// SUPPORT SERVICE - Substituir dados mockados do CustomerSupport
export interface SupportTicket {
  id: string;
  subject: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  agent_id?: string;
  agent_name?: string;
  resolution?: string;
  created_at: string;
  resolved_at?: string;
  updated_at: string;
}

export interface SupportMetrics {
  date: string;
  tickets: number;
  resolved: number;
  avgResponseTime: number;
}

export class SupportService {
  /**
   * Criar novo ticket de suporte
   */
  static async createTicket(ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
    try {
      const newTicket = {
        subject: ticketData.subject,
        description: ticketData.description,
        status: ticketData.status || 'open',
        priority: ticketData.priority || 'medium',
        customer_name: ticketData.customer_name,
        customer_email: ticketData.customer_email,
        customer_phone: ticketData.customer_phone,
        agent_id: ticketData.agent_id,
        agent_name: ticketData.agent_name
      };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([newTicket])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar ticket:', error);
        throw new Error(`Falha ao criar ticket: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em SupportService.createTicket:', error);
      throw error;
    }
  }

  /**
   * Obter todos os tickets
   */
  static async getAllTickets(filters?: {
    status?: string;
    priority?: string;
    limit?: number;
  }): Promise<SupportTicket[]> {
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar tickets:', error);
        throw new Error(`Falha ao buscar tickets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro em SupportService.getAllTickets:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de suporte
   */
  static async getSupportStats(): Promise<{
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    totalTickets: number;
    avgResolutionTime: number;
    satisfactionRate: number;
  }> {
    try {
      // Total de tickets
      const { count: totalTickets, error: totalError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Tickets por status
      const { data: statusData, error: statusError } = await supabase
        .from('support_tickets')
        .select('status, created_at, resolved_at');

      if (statusError) throw statusError;

      const statusCounts = (statusData || []).reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calcular tempo médio de resolução
      const resolvedTickets = (statusData || []).filter(ticket => ticket.resolved_at);
      const avgResolutionTime = resolvedTickets.length > 0 
        ? resolvedTickets.reduce((sum, ticket) => {
            const resolutionTime = new Date(ticket.resolved_at!).getTime() - new Date(ticket.created_at).getTime();
            return sum + resolutionTime;
          }, 0) / resolvedTickets.length / (1000 * 60) // converter para minutos
        : 0;

      // Taxa de satisfação simulada (em produção viria de pesquisas)
      const satisfactionRate = 85;

      return {
        totalTickets: totalTickets || 0,
        openTickets: statusCounts['open'] || 0,
        inProgressTickets: statusCounts['in_progress'] || 0,
        resolvedTickets: statusCounts['resolved'] || 0,
        avgResolutionTime: Math.round(avgResolutionTime),
        satisfactionRate
      };
    } catch (error) {
      console.error('Erro em SupportService.getSupportStats:', error);
      return {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        avgResolutionTime: 0,
        satisfactionRate: 0
      };
    }
  }

  /**
   * Obter métricas dos últimos 7 dias
   */
  static async getWeeklyMetrics(): Promise<SupportMetrics[]> {
    try {
      // Gerar dados dos últimos 7 dias
      const metrics: SupportMetrics[] = [];
      const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        // Tickets criados no dia
        const { count: tickets, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dayStart)
          .lte('created_at', dayEnd);

        // Tickets resolvidos no dia
        const { count: resolved, error: resolvedError } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .gte('resolved_at', dayStart)
          .lte('resolved_at', dayEnd);

        if (!ticketsError && !resolvedError) {
          metrics.push({
            date: days[6 - i],
            tickets: tickets || 0,
            resolved: resolved || 0,
            avgResponseTime: Math.floor(Math.random() * 20) + 10 // Simulado
          });
        }
      }

      return metrics;
    } catch (error) {
      console.error('Erro em SupportService.getWeeklyMetrics:', error);
      return [];
    }
  }

  /**
   * Atualizar ticket
   */
  static async updateTicket(id: string, updateData: Partial<SupportTicket>): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar ticket:', error);
        throw new Error(`Falha ao atualizar ticket: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro em SupportService.updateTicket:', error);
      throw error;
    }
  }
}

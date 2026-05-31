import { supabase } from '../client'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: string
  score: number
  created_at: string
  updated_at: string
}

export interface LeadStats {
  total_leads: number
  new_leads_today: number
  conversion_rate: number
  avg_score: number
}

/**
 * Serviço para gerenciar leads no Supabase
 */
export class LeadsService {
  /**
   * Obtém estatísticas de leads
   * @returns Estatísticas de leads
   */
  static async getLeadStats(): Promise<LeadStats> {
    try {
      // Contar todos os usuários com role 'customer' como leads
      const { count: totalLeads, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')

      if (countError) throw countError

      // Calcular leads novos hoje
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: newLeadsToday, error: newLeadsError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
        .gte('created_at', today.toISOString())

      if (newLeadsError) throw newLeadsError

      // Valores simulados para taxa de conversão e score médio
      // Em uma implementação real, esses valores viriam de análises reais
      const conversionRate = 12.5
      const avgScore = 72

      return {
        total_leads: totalLeads || 0,
        new_leads_today: newLeadsToday || 0,
        conversion_rate: conversionRate,
        avg_score: avgScore
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas de leads:', error)
      // Retornar valores padrão em caso de erro
      return {
        total_leads: 0,
        new_leads_today: 0,
        conversion_rate: 0,
        avg_score: 0
      }
    }
  }
  
  /**
   * Obtém todos os leads (usuários com role 'customer')
   * @returns Lista de leads
   */
  static async getAllLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Mapear os usuários para o formato de leads
      return data.map(user => ({
        id: user.id,
        name: user.full_name || 'Nome não informado',
        email: user.email,
        phone: '', // Não temos telefone nos usuários atuais
        status: 'novo', // Status padrão
        score: 50, // Score padrão
        created_at: user.created_at,
        updated_at: user.updated_at
      }))
    } catch (error) {
      console.error('Erro ao obter leads:', error)
      return []
    }
  }
}
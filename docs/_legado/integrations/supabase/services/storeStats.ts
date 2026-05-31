import { supabase } from '../client'

// Tipo para as estatísticas das lojas
export interface StoreStats {
  store_id: string
  store_name: string
  store_slug: string
  product_count: number
  average_product_price: number
  store_rating: number
  store_review_count: number
  store_created_at: string
}

/**
 * Serviço para gerenciar estatísticas das lojas
 */
export class StoreStatsService {
  /**
   * Obtém as estatísticas de todas as lojas
   * @returns Lista de estatísticas das lojas
   */
  static async getAllStoreStats(): Promise<StoreStats[]> {
    try {
      const { data, error } = await supabase
        .from('store_stats')
        .select('*')
        .order('store_name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao obter estatísticas das lojas:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas de uma loja específica
   * @param storeId ID da loja
   * @returns Estatísticas da loja ou null
   */
  static async getStoreStatsById(storeId: string): Promise<StoreStats | null> {
    try {
      const { data, error } = await supabase
        .from('store_stats')
        .select('*')
        .eq('store_id', storeId)
        .single()

      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Erro ao obter estatísticas da loja:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas das lojas ordenadas por número de produtos
   * @param limit Limite de resultados (opcional)
   * @returns Lista de estatísticas das lojas
   */
  static async getStoreStatsByProductCount(limit?: number): Promise<StoreStats[]> {
    try {
      let query = supabase
        .from('store_stats')
        .select('*')
        .order('product_count', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao obter estatísticas das lojas por número de produtos:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas das lojas ordenadas por avaliação
   * @param limit Limite de resultados (opcional)
   * @returns Lista de estatísticas das lojas
   */
  static async getStoreStatsByRating(limit?: number): Promise<StoreStats[]> {
    try {
      let query = supabase
        .from('store_stats')
        .select('*')
        .order('store_rating', { ascending: false })
        .order('store_review_count', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao obter estatísticas das lojas por avaliação:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas das lojas ordenadas por data de criação
   * @param limit Limite de resultados (opcional)
   * @returns Lista de estatísticas das lojas
   */
  static async getStoreStatsByCreatedAt(limit?: number): Promise<StoreStats[]> {
    try {
      let query = supabase
        .from('store_stats')
        .select('*')
        .order('store_created_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao obter estatísticas das lojas por data de criação:', error)
      throw error
    }
  }

  /**
   * Pesquisa estatísticas de lojas por nome
   * @param searchTerm Termo de pesquisa
   * @returns Lista de estatísticas das lojas que correspondem ao termo
   */
  static async searchStoreStats(searchTerm: string): Promise<StoreStats[]> {
    try {
      const { data, error } = await supabase
        .from('store_stats')
        .select('*')
        .ilike('store_name', `%${searchTerm}%`)
        .order('store_name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao pesquisar estatísticas das lojas:', error)
      throw error
    }
  }

  /**
   * Atualiza as estatísticas das lojas (se estiver usando materialized view)
   * @returns true se atualizado, false caso contrário
   */
  static async refreshStoreStats(): Promise<boolean> {
    try {
      // Tentar chamar a função de atualização
      const { error } = await supabase.rpc('refresh_store_stats')
      
      if (error) {
        // Se a função não existir, tentar criar
        console.warn('Função refresh_store_stats não encontrada, tentando criar...')
        throw error
      }
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar estatísticas das lojas:', error)
      return false
    }
  }
}
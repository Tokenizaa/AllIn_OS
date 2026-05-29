import { Product } from '@/types/products'
import { User } from '@/types/users'

import { supabase } from '../client'

export interface DashboardStats {
  usersCount: number
  productsCount: number
  conversationsCount: number
  revenue: number
  leadsCount: number
  ordersCount: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  outOfStockProducts: number
}

export interface RealTimeMetrics {
  activeUsers: number
  activeConversations: number
  pendingOrders: number
  conversionRate: number
}

/**
 * Serviço para gerenciar estatísticas do dashboard no Supabase
 */
export class DashboardService {
  /**
   * Obtém as estatísticas principais do dashboard
   * @returns Estatísticas do dashboard
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Contar usuários
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // Contar produtos
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (productsError) throw productsError

      // Contar lojas (como proxy para conversas)
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })

      if (storesError) throw storesError

      // Valores simulados para receita, leads e pedidos
      // Em uma implementação real, esses valores viriam de tabelas específicas
      const revenue = 12580
      const leadsCount = 78
      const ordersCount = 42

      return {
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
        conversationsCount: storesCount || 0,
        revenue,
        leadsCount,
        ordersCount
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas do dashboard:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas de usuários
   * @returns Estatísticas de usuários
   */
  static async getUserStats(): Promise<UserStats> {
    try {
      // Contar todos os usuários
      const { count: totalUsers, error: totalError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Contar usuários ativos (todos, neste caso)
      const activeUsers = totalUsers || 0

      // Contar usuários administradores
      const { count: adminUsers, error: adminError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')

      if (adminError) throw adminError

      // Calcular usuários inativos (0 neste caso)
      const inactiveUsers = 0

      return {
        totalUsers: totalUsers || 0,
        activeUsers,
        inactiveUsers,
        adminUsers: adminUsers || 0
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas de usuários:', error)
      throw error
    }
  }

  /**
   * Obtém as estatísticas de produtos
   * @returns Estatísticas de produtos
   */
  static async getProductStats(): Promise<ProductStats> {
    try {
      // Contar todos os produtos
      const { count: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Contar produtos ativos
      const { count: activeProducts, error: activeError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('availability', true)

      if (activeError) throw activeError

      // Contar produtos com estoque baixo (simulado)
      const lowStockProducts = 3

      // Contar produtos sem estoque
      const { count: outOfStockProducts, error: outOfStockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('availability', false)

      if (outOfStockError) throw outOfStockError

      return {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        lowStockProducts,
        outOfStockProducts: outOfStockProducts || 0
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas de produtos:', error)
      throw error
    }
  }

  /**
   * Obtém métricas em tempo real
   * @returns Métricas em tempo real
   */
  static async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      // Contar usuários (simulado)
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (userError) throw userError

      // Contar lojas (como proxy para conversas ativas)
      const { count: storeCount, error: storeError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })

      if (storeError) throw storeError

      // Valores simulados para pedidos pendentes e taxa de conversão
      // Em uma implementação real, esses valores viriam de análises em tempo real
      const pendingOrders = 5
      const conversionRate = 7.5

      return {
        activeUsers: userCount || 0,
        activeConversations: storeCount || 0,
        pendingOrders,
        conversionRate
      }
    } catch (error) {
      console.error('Erro ao obter métricas em tempo real:', error)
      throw error
    }
  }
}
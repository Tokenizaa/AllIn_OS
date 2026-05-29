import { useState, useEffect, useCallback } from 'react'

import { 
  DashboardService, 
  DashboardStats, 
  UserStats, 
  ProductStats, 
  RealTimeMetrics 
} from '@/integrations/supabase/services/dashboard'

interface UseDashboardReturn {
  dashboardStats: DashboardStats | null
  userStats: UserStats | null
  productStats: ProductStats | null
  realTimeMetrics: RealTimeMetrics | null
  loading: boolean
  error: Error | null
  fetchAllDashboardData: () => Promise<void>
  fetchDashboardStats: () => Promise<void>
  fetchUserStats: () => Promise<void>
  fetchProductStats: () => Promise<void>
  fetchRealTimeMetrics: () => Promise<void>
}

export const useSupabaseDashboard = (): UseDashboardReturn => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [productStats, setProductStats] = useState<ProductStats | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await DashboardService.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas do dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await DashboardService.getUserStats()
      setUserStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas de usuários:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProductStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await DashboardService.getProductStats()
      setProductStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas de produtos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRealTimeMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const metrics = await DashboardService.getRealTimeMetrics()
      setRealTimeMetrics(metrics)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar métricas em tempo real:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Buscar todos os dados em paralelo
      const [dashboardStats, userStats, productStats, realTimeMetrics] = await Promise.all([
        DashboardService.getDashboardStats(),
        DashboardService.getUserStats(),
        DashboardService.getProductStats(),
        DashboardService.getRealTimeMetrics()
      ])
      
      setDashboardStats(dashboardStats)
      setUserStats(userStats)
      setProductStats(productStats)
      setRealTimeMetrics(realTimeMetrics)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar todos os dados do dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar todos os dados ao inicializar
  useEffect(() => {
    fetchAllDashboardData()
  }, [fetchAllDashboardData])

  return {
    dashboardStats,
    userStats,
    productStats,
    realTimeMetrics,
    loading,
    error,
    fetchAllDashboardData,
    fetchDashboardStats,
    fetchUserStats,
    fetchProductStats,
    fetchRealTimeMetrics
  }
}
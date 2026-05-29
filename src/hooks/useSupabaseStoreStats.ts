import { useState, useEffect, useCallback } from 'react'

import { StoreStatsService, StoreStats } from '@/integrations/supabase/services/storeStats'

interface UseStoreStatsReturn {
  storeStats: StoreStats[]
  loading: boolean
  error: Error | null
  fetchAllStoreStats: () => Promise<void>
  fetchStoreStatsById: (storeId: string) => Promise<StoreStats | null>
  fetchStoreStatsByProductCount: (limit?: number) => Promise<void>
  fetchStoreStatsByRating: (limit?: number) => Promise<void>
  fetchStoreStatsByCreatedAt: (limit?: number) => Promise<void>
  searchStoreStats: (searchTerm: string) => Promise<void>
}

export const useSupabaseStoreStats = (): UseStoreStatsReturn => {
  const [storeStats, setStoreStats] = useState<StoreStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAllStoreStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.getAllStoreStats()
      setStoreStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas das lojas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStoreStatsById = useCallback(async (storeId: string) => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.getStoreStatsById(storeId)
      return stats
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas da loja:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStoreStatsByProductCount = useCallback(async (limit?: number) => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.getStoreStatsByProductCount(limit)
      setStoreStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas das lojas por número de produtos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStoreStatsByRating = useCallback(async (limit?: number) => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.getStoreStatsByRating(limit)
      setStoreStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas das lojas por avaliação:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStoreStatsByCreatedAt = useCallback(async (limit?: number) => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.getStoreStatsByCreatedAt(limit)
      setStoreStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas das lojas por data de criação:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchStoreStats = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true)
      setError(null)
      const stats = await StoreStatsService.searchStoreStats(searchTerm)
      setStoreStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao pesquisar estatísticas das lojas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllStoreStats()
  }, [fetchAllStoreStats])

  return {
    storeStats,
    loading,
    error,
    fetchAllStoreStats,
    fetchStoreStatsById,
    fetchStoreStatsByProductCount,
    fetchStoreStatsByRating,
    fetchStoreStatsByCreatedAt,
    searchStoreStats
  }
}
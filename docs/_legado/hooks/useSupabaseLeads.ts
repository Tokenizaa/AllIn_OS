import { useState, useEffect, useCallback } from 'react'

import { LeadsService, LeadStats, Lead } from '@/integrations/supabase/services/leads'

interface UseLeadsReturn {
  leadStats: LeadStats | null
  leads: Lead[]
  loading: boolean
  error: Error | null
  fetchLeadStats: () => Promise<void>
  fetchAllLeads: () => Promise<void>
}

export const useSupabaseLeads = (): UseLeadsReturn => {
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLeadStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await LeadsService.getLeadStats()
      setLeadStats(stats)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar estatísticas de leads:', err)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const fetchAllLeads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const leadsData = await LeadsService.getAllLeads()
      setLeads(leadsData)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar leads:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeadStats()
    fetchAllLeads()
  }, [fetchLeadStats, fetchAllLeads])

  return {
    leadStats,
    leads,
    loading,
    error,
    fetchLeadStats,
    fetchAllLeads
  }
}
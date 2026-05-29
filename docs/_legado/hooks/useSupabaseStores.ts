import { useState, useEffect, useCallback, useRef } from 'react'

import { RealtimeChannel } from '@supabase/supabase-js'

import { StoresService } from '@/integrations/supabase/services/stores'
import { StoreInfo } from '@/types/store'

interface UseStoresReturn {
  stores: StoreInfo[]
  loading: boolean
  error: Error | null
  createStore: (storeData: Omit<StoreInfo, 'id' | 'createdAt' | 'updatedAt'> & { ownerId: string }) => Promise<StoreInfo | null>
  getStoreBySlug: (slug: string) => Promise<StoreInfo | undefined>
  getAllStores: () => Promise<StoreInfo[]>
  updateStore: (id: string, storeData: Partial<StoreInfo>) => Promise<StoreInfo | null>
  deleteStore: (id: string) => Promise<boolean>
  isSlugAvailable: (slug: string) => Promise<boolean>
}

export const useSupabaseStores = (): UseStoresReturn => {
  const [stores, setStores] = useState<StoreInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const storesData = await StoresService.getAllStores()
      setStores(storesData)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar lojas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createStore = useCallback(async (storeData: Omit<StoreInfo, 'id' | 'createdAt' | 'updatedAt'> & { ownerId: string }) => {
    try {
      setLoading(true)
      setError(null)
      const newStore = await StoresService.createStore(storeData)
      if (newStore) {
        setStores(prev => [newStore, ...prev])
      }
      return newStore
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao criar loja:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getStoreBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)
      const store = await StoresService.getStoreBySlug(slug)
      return store
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao obter loja por slug:', err)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [])

  const getAllStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const storesData = await StoresService.getAllStores()
      setStores(storesData)
      return storesData
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao obter lojas:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStore = useCallback(async (id: string, storeData: Partial<StoreInfo>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedStore = await StoresService.updateStore(id, storeData)
      if (updatedStore) {
        setStores(prev => prev.map(store => store.id === id ? updatedStore : store))
      }
      return updatedStore
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao atualizar loja:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteStore = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await StoresService.deleteStore(id)
      if (result) {
        setStores(prev => prev.filter(store => store.id !== id))
      }
      return result
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao remover loja:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const isSlugAvailable = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)
      const available = await StoresService.isSlugAvailable(slug)
      return available
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao verificar disponibilidade de slug:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Efeito para configurar a subscrição em tempo real
  useEffect(() => {
    subscriptionRef.current = StoresService.subscribeToStoreChanges((payload) => {
      // Atualizar a lista de lojas quando houver mudanças
      fetchStores()
    })

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [fetchStores])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  return {
    stores,
    loading,
    error,
    createStore,
    getStoreBySlug,
    getAllStores,
    updateStore,
    deleteStore,
    isSlugAvailable
  }
}
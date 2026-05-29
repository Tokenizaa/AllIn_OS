import { RealtimeChannel } from '@supabase/supabase-js'

import { StoreInfo } from '@/types/store'

import { supabase } from '../client'

// Tipos para lojas no Supabase
export interface SupabaseStore {
  id: string
  slug: string
  name: string
  category: string
  city: string
  description: string
  logo: string
  banners: string[]
  rating: number
  review_count: number
  specialties: string[]
  contact: {
    whatsapp: string
    instagram: string
    email: string
    address: string
  }
  primary_color: string
  secondary_color: string
  custom_message: string
  owner_id: string
  created_at: string
  updated_at: string
}

/**
 * Serviço para gerenciar lojas no Supabase
 */
export class StoresService {
  /**
   * Cria uma nova loja
   * @param storeData Dados da loja
   * @returns Loja criada
   */
  static async createStore(storeData: Omit<StoreInfo, 'id' | 'createdAt' | 'updatedAt'> & { ownerId: string }): Promise<StoreInfo> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert({
          slug: storeData.slug,
          name: storeData.name,
          category: storeData.category,
          city: storeData.city,
          description: storeData.description,
          logo: storeData.logo,
          banners: storeData.banners,
          rating: storeData.rating,
          review_count: storeData.reviewCount,
          specialties: storeData.specialties,
          contact: storeData.contact,
          primary_color: storeData.primaryColor,
          secondary_color: storeData.secondaryColor,
          custom_message: storeData.customMessage,
          owner_id: storeData.ownerId
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo,
        banners: data.banners,
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao criar loja:', error)
      throw error
    }
  }

  /**
   * Obtém uma loja pelo slug
   * @param slug Slug da loja
   * @returns Loja encontrada ou undefined
   */
  static async getStoreBySlug(slug: string): Promise<StoreInfo | undefined> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo,
        banners: data.banners,
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao obter loja por slug:', error)
      throw error
    }
  }

  /**
   * Obtém todas as lojas
   * @returns Lista de lojas
   */
  static async getAllStores(): Promise<StoreInfo[]> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(store => ({
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category,
        city: store.city,
        description: store.description,
        logo: store.logo,
        banners: store.banners,
        rating: store.rating,
        reviewCount: store.review_count,
        specialties: store.specialties,
        contact: store.contact,
        primaryColor: store.primary_color,
        secondaryColor: store.secondary_color,
        customMessage: store.custom_message,
        createdAt: new Date(store.created_at),
        updatedAt: new Date(store.updated_at)
      }))
    } catch (error) {
      console.error('Erro ao obter lojas:', error)
      throw error
    }
  }

  /**
   * Atualiza uma loja existente
   * @param id ID da loja
   * @param storeData Dados atualizados
   * @returns Loja atualizada ou null
   */
  static async updateStore(id: string, storeData: Partial<StoreInfo>): Promise<StoreInfo | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({
          slug: storeData.slug,
          name: storeData.name,
          category: storeData.category,
          city: storeData.city,
          description: storeData.description,
          logo: storeData.logo,
          banners: storeData.banners,
          rating: storeData.rating,
          review_count: storeData.reviewCount,
          specialties: storeData.specialties,
          contact: storeData.contact,
          primary_color: storeData.primaryColor,
          secondary_color: storeData.secondaryColor,
          custom_message: storeData.customMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo,
        banners: data.banners,
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao atualizar loja:', error)
      throw error
    }
  }

  /**
   * Remove uma loja
   * @param id ID da loja
   * @returns true se removido, false caso contrário
   */
  static async deleteStore(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao remover loja:', error)
      return false
    }
  }

  /**
   * Verifica se um slug já existe
   * @param slug Slug a verificar
   * @returns true se disponível, false caso contrário
   */
  static async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return !data
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de slug:', error)
      throw error
    }
  }

  /**
   * Subscreve às mudanças em tempo real nas lojas
   * @param callback Função a ser chamada quando houver mudanças
   * @returns Canal de subscrição
   */
  static subscribeToStoreChanges(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('stores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stores'
        },
        callback
      )
      .subscribe()
  }
}
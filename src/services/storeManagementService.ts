// SUBSTITUIÇÃO COMPLETA: storeManagementService.ts
// Este arquivo substitui completamente o service baseado em memória

import { StoreInfo, StoreFormData } from '@/types/store';
import { supabase } from '@/integrations/supabase/client';

export class StoreService {
  /**
   * Criar uma nova loja no Supabase
   */
  static async createStore(storeData: StoreFormData): Promise<StoreInfo> {
    try {
      // Verificar se o slug já existe
      const { data: existingStore, error: checkError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', storeData.slug)
        .single();

      if (existingStore) {
        throw new Error('Já existe uma loja com este identificador');
      }

      // Preparar dados para inserção
      const newStoreData = {
        slug: storeData.slug,
        name: storeData.name,
        category: storeData.category,
        city: storeData.city,
        description: storeData.description,
        rating: storeData.rating || 0,
        review_count: storeData.reviewCount || 0,
        specialties: storeData.specialties || [],
        contact: storeData.contact || {},
        primary_color: storeData.primaryColor || '#F2A801',
        secondary_color: storeData.secondaryColor || '#1a202c',
        custom_message: storeData.customMessage,
        sponsor_link: storeData.sponsorLink || null,
        is_public: true
      };

      const { data, error } = await supabase
        .from('stores')
        .insert([newStoreData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar loja:', error);
        throw new Error(`Falha ao criar loja: ${error.message}`);
      }

      // Converter para o formato esperado pelo frontend
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo || 'https://placehold.co/200x200',
        banners: data.banners || [
          'https://placehold.co/1200x400',
          'https://placehold.co/1200x400',
          'https://placehold.co/1200x400'
        ],
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        sponsorLink: data.sponsor_link,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Erro em StoreService.createStore:', error);
      throw error;
    }
  }

  /**
   * Obter loja pelo slug
   */
  static async getStoreBySlug(slug: string): Promise<StoreInfo | undefined> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error || !data) {
        return undefined;
      }

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo || 'https://placehold.co/200x200',
        banners: data.banners || [],
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        sponsorLink: data.sponsor_link,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Erro em StoreService.getStoreBySlug:', error);
      return undefined;
    }
  }

  /**
   * Obter todas as lojas
   */
  static async getAllStores(): Promise<StoreInfo[]> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar lojas:', error);
        throw new Error(`Falha ao buscar lojas: ${error.message}`);
      }

      return (data || []).map(store => ({
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category,
        city: store.city,
        description: store.description,
        logo: store.logo || 'https://placehold.co/200x200',
        banners: store.banners || [],
        rating: store.rating,
        reviewCount: store.review_count,
        specialties: store.specialties,
        contact: store.contact,
        primaryColor: store.primary_color,
        secondaryColor: store.secondary_color,
        customMessage: store.custom_message,
        sponsorLink: store.sponsor_link,
        createdAt: new Date(store.created_at),
        updatedAt: new Date(store.updated_at)
      }));
    } catch (error) {
      console.error('Erro em StoreService.getAllStores:', error);
      throw error;
    }
  }

  /**
   * Atualizar loja
   */
  static async updateStore(id: string, storeData: Partial<StoreFormData>): Promise<StoreInfo | null> {
    try {
      // Preparar dados para atualização
      const updateData: any = {};
      
      if (storeData.name) updateData.name = storeData.name;
      if (storeData.category) updateData.category = storeData.category;
      if (storeData.city) updateData.city = storeData.city;
      if (storeData.description) updateData.description = storeData.description;
      if (storeData.rating !== undefined) updateData.rating = storeData.rating;
      if (storeData.reviewCount !== undefined) updateData.review_count = storeData.reviewCount;
      if (storeData.specialties) updateData.specialties = storeData.specialties;
      if (storeData.contact) updateData.contact = storeData.contact;
      if (storeData.primaryColor) updateData.primary_color = storeData.primaryColor;
      if (storeData.secondaryColor) updateData.secondary_color = storeData.secondaryColor;
      if (storeData.customMessage !== undefined) updateData.custom_message = storeData.customMessage;
      if (storeData.sponsorLink !== undefined) updateData.sponsor_link = storeData.sponsorLink;

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('stores')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar loja:', error);
        throw new Error(`Falha ao atualizar loja: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        description: data.description,
        logo: data.logo || 'https://placehold.co/200x200',
        banners: data.banners || [],
        rating: data.rating,
        reviewCount: data.review_count,
        specialties: data.specialties,
        contact: data.contact,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        customMessage: data.custom_message,
        sponsorLink: data.sponsor_link,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Erro em StoreService.updateStore:', error);
      throw error;
    }
  }

  /**
   * Deletar loja
   */
  static async deleteStore(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar loja:', error);
        throw new Error(`Falha ao deletar loja: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Erro em StoreService.deleteStore:', error);
      throw error;
    }
  }

  /**
   * Verificar se o slug já existe
   */
  static async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', slug)
        .single();

      return !data && !error;
    } catch (error) {
      console.error('Erro em StoreService.isSlugAvailable:', error);
      return false;
    }
  }

  /**
   * Obter estatísticas das lojas
   */
  static async getStoreStats(): Promise<{
    totalStores: number;
    activeStores: number;
    storesByCategory: Record<string, number>;
    storesByCity: Record<string, number>;
  }> {
    try {
      // Total de lojas
      const { count: totalStores, error: totalError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      if (totalError) throw totalError;

      // Lojas por categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('stores')
        .select('category')
        .eq('is_public', true);

      if (categoryError) throw categoryError;

      const storesByCategory = (categoryData || []).reduce((acc, store) => {
        acc[store.category] = (acc[store.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Lojas por cidade
      const { data: cityData, error: cityError } = await supabase
        .from('stores')
        .select('city')
        .eq('is_public', true);

      if (cityError) throw cityError;

      const storesByCity = (cityData || []).reduce((acc, store) => {
        acc[store.city] = (acc[store.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalStores: totalStores || 0,
        activeStores: totalStores || 0, // Todas as lojas públicas são consideradas ativas
        storesByCategory,
        storesByCity
      };
    } catch (error) {
      console.error('Erro em StoreService.getStoreStats:', error);
      return {
        totalStores: 0,
        activeStores: 0,
        storesByCategory: {},
        storesByCity: {}
      };
    }
  }

  /**
   * Buscar lojas com filtros
   */
  static async searchStores(filters: {
    category?: string;
    city?: string;
    searchTerm?: string;
  }): Promise<StoreInfo[]> {
    try {
      let query = supabase
        .from('stores')
        .select('*')
        .eq('is_public', true);

      // Aplicar filtros
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar lojas:', error);
        throw new Error(`Falha ao buscar lojas: ${error.message}`);
      }

      return (data || []).map(store => ({
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category,
        city: store.city,
        description: store.description,
        logo: store.logo || 'https://placehold.co/200x200',
        banners: store.banners || [],
        rating: store.rating,
        reviewCount: store.review_count,
        specialties: store.specialties,
        contact: store.contact,
        primaryColor: store.primary_color,
        secondaryColor: store.secondary_color,
        customMessage: store.custom_message,
        sponsorLink: store.sponsor_link,
        createdAt: new Date(store.created_at),
        updatedAt: new Date(store.updated_at)
      }));
    } catch (error) {
      console.error('Erro em StoreService.searchStores:', error);
      throw error;
    }
  }
}

// Exportar o service com o mesmo nome do antigo para compatibilidade
export const storeManagementService = StoreService;

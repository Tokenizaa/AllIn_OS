// src/integrations/supabase/services/apiKeys.ts
import { supabase } from '@/integrations/supabase/client';
import { ApiKey } from '@/types/apiKeys';

export const apiKeysService = {
  // Get all API keys for a store
  async getApiKeys(storeId: string): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching API keys: ${error.message}`);
    }

    return data as ApiKey[];
  },

  // Get active API key for a specific platform
  async getActiveApiKey(storeId: string, platform: 'meta_ads' | 'google_ads'): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('store_id', storeId)
      .eq('platform', platform)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching active API key: ${error.message}`);
    }

    return data as ApiKey || null;
  },

  // Create a new API key
  async createApiKey(storeId: string, apiKeyData: any): Promise<ApiKey> {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          store_id: storeId,
          ...apiKeyData
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating API key: ${error.message}`);
    }

    return data as ApiKey;
  },

  // Update an existing API key
  async updateApiKey(id: string, apiKeyData: Partial<any>): Promise<ApiKey> {
    const { data, error } = await supabase
      .from('api_keys')
      .update(apiKeyData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating API key: ${error.message}`);
    }

    return data as ApiKey;
  },

  // Deactivate an API key
  async deactivateApiKey(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Error deactivating API key: ${error.message}`);
    }
  },

  // Delete an API key
  async deleteApiKey(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting API key: ${error.message}`);
    }
  }
};
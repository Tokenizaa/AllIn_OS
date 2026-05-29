// src/hooks/useApiKeys.ts
import { useState, useEffect } from 'react';

import { apiKeyService } from '@/services/apiKeyService';
import { ApiKey } from '@/types/apiKeys';

export const useApiKeys = (storeId: string) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiKeyService.getApiKeys(storeId);
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (apiKeyData: any) => {
    try {
      const newKey = await apiKeyService.createApiKey(storeId, apiKeyData);
      setApiKeys(prev => [newKey, ...prev]);
      return newKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const updateApiKey = async (id: string, apiKeyData: Partial<any>) => {
    try {
      const updatedKey = await apiKeyService.updateApiKey(id, apiKeyData);
      setApiKeys(prev => prev.map(key => key.id === id ? updatedKey : key));
      return updatedKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const deactivateApiKey = async (id: string) => {
    try {
      await apiKeyService.deactivateApiKey(id);
      setApiKeys(prev => prev.map(key => key.id === id ? { ...key, is_active: false } : key));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchApiKeys();
    }
  }, [storeId]);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deactivateApiKey,
    deleteApiKey
  };
};
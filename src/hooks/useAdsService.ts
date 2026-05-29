// src/hooks/useAdsService.ts
import { useState, useEffect } from 'react';

import { AdsService } from '@/services/adsService';

import { useApiKeys } from './useApiKeys';

export const useAdsService = (storeId: string) => {
  const { apiKeys, loading: apiKeysLoading, error: apiKeysError } = useApiKeys(storeId);
  const [adsService, setAdsService] = useState<AdsService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKeysLoading && apiKeys) {
      try {
        const service = new AdsService(apiKeys);
        setAdsService(service);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize ads service');
      } finally {
        setLoading(false);
      }
    }
  }, [apiKeys, apiKeysLoading]);

  // Meta Ads functions
  const getMetaAdAccounts = async () => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.getMetaAdAccounts();
  };

  const getMetaCampaigns = async (adAccountId: string) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.getMetaCampaigns(adAccountId);
  };

  const createMetaCampaign = async (adAccountId: string, campaignData: any) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.createMetaCampaign(adAccountId, campaignData);
  };

  const sendMetaConversionEvent = async (eventData: any) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.sendMetaConversionEvent(eventData);
  };

  // Google Ads functions
  const getGoogleAdsCustomers = async () => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.getGoogleAdsCustomers();
  };

  const getGoogleAdsCampaigns = async (customerId: string) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.getGoogleAdsCampaigns(customerId);
  };

  const createGoogleAdsCampaign = async (customerId: string, campaignData: any) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.createGoogleAdsCampaign(customerId, campaignData);
  };

  const getGoogleAdsMetrics = async (customerId: string, dateRange: { start: string; end: string }) => {
    if (!adsService) throw new Error('Ads service not initialized');
    return adsService.getGoogleAdsMetrics(customerId, dateRange);
  };

  return {
    // State
    adsService,
    loading: apiKeysLoading || loading,
    error: apiKeysError || error,
    
    // Service availability
    isMetaAdsAvailable: adsService?.isMetaAdsAvailable() || false,
    isGoogleAdsAvailable: adsService?.isGoogleAdsAvailable() || false,
    
    // Meta Ads functions
    getMetaAdAccounts,
    getMetaCampaigns,
    createMetaCampaign,
    sendMetaConversionEvent,
    
    // Google Ads functions
    getGoogleAdsCustomers,
    getGoogleAdsCampaigns,
    createGoogleAdsCampaign,
    getGoogleAdsMetrics
  };
};
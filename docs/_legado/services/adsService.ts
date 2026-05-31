// src/services/adsService.ts
import { ApiKey } from '@/types/apiKeys';

import { GoogleAdsService } from './googleAdsService';
import { MetaAdsService } from './metaAdsService';

export class AdsService {
  private metaAdsService: MetaAdsService | null = null;
  private googleAdsService: GoogleAdsService | null = null;

  constructor(apiKeys: ApiKey[]) {
    // Initialize services based on available API keys
    const metaKey = apiKeys.find(key => key.platform === 'meta_ads' && key.is_active);
    const googleKey = apiKeys.find(key => key.platform === 'google_ads' && key.is_active);

    if (metaKey) {
      try {
        this.metaAdsService = new MetaAdsService(metaKey);
      } catch (error) {
        console.error('Failed to initialize Meta Ads service:', error);
      }
    }

    if (googleKey) {
      try {
        this.googleAdsService = new GoogleAdsService(googleKey);
      } catch (error) {
        console.error('Failed to initialize Google Ads service:', error);
      }
    }
  }

  /**
   * Get ad accounts from Meta Ads
   */
  async getMetaAdAccounts(): Promise<any> {
    if (!this.metaAdsService) {
      throw new Error('Meta Ads service not initialized. Please add a Meta Ads API key.');
    }
    return this.metaAdsService.getAdAccounts();
  }

  /**
   * Get campaigns from Meta Ads for a specific account
   */
  async getMetaCampaigns(adAccountId: string): Promise<any> {
    if (!this.metaAdsService) {
      throw new Error('Meta Ads service not initialized. Please add a Meta Ads API key.');
    }
    return this.metaAdsService.getCampaigns(adAccountId);
  }

  /**
   * Create a campaign in Meta Ads
   */
  async createMetaCampaign(adAccountId: string, campaignData: any): Promise<any> {
    if (!this.metaAdsService) {
      throw new Error('Meta Ads service not initialized. Please add a Meta Ads API key.');
    }
    return this.metaAdsService.createCampaign(adAccountId, campaignData);
  }

  /**
   * Send conversion event to Meta Conversions API
   */
  async sendMetaConversionEvent(eventData: any): Promise<any> {
    if (!this.metaAdsService) {
      throw new Error('Meta Ads service not initialized. Please add a Meta Ads API key.');
    }
    return this.metaAdsService.sendConversionEvent(eventData);
  }

  /**
   * Get accessible customers from Google Ads
   */
  async getGoogleAdsCustomers(): Promise<any> {
    if (!this.googleAdsService) {
      throw new Error('Google Ads service not initialized. Please add a Google Ads API key.');
    }
    return this.googleAdsService.getAccessibleCustomers();
  }

  /**
   * Get campaigns from Google Ads for a specific customer
   */
  async getGoogleAdsCampaigns(customerId: string): Promise<any> {
    if (!this.googleAdsService) {
      throw new Error('Google Ads service not initialized. Please add a Google Ads API key.');
    }
    return this.googleAdsService.getCampaigns(customerId);
  }

  /**
   * Create a campaign in Google Ads
   */
  async createGoogleAdsCampaign(customerId: string, campaignData: any): Promise<any> {
    if (!this.googleAdsService) {
      throw new Error('Google Ads service not initialized. Please add a Google Ads API key.');
    }
    return this.googleAdsService.createCampaign(customerId, campaignData);
  }

  /**
   * Get campaign metrics from Google Ads
   */
  async getGoogleAdsMetrics(customerId: string, dateRange: { start: string; end: string }): Promise<any> {
    if (!this.googleAdsService) {
      throw new Error('Google Ads service not initialized. Please add a Google Ads API key.');
    }
    return this.googleAdsService.getCampaignMetrics(customerId, dateRange);
  }

  /**
   * Check if services are available
   */
  isMetaAdsAvailable(): boolean {
    return this.metaAdsService !== null;
  }

  isGoogleAdsAvailable(): boolean {
    return this.googleAdsService !== null;
  }
}
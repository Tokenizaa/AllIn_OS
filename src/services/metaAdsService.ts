// src/services/metaAdsService.ts
import { ApiKey } from '@/types/apiKeys';

export class MetaAdsService {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com/v20.0';

  constructor(apiKey: ApiKey) {
    if (!apiKey.access_token) {
      throw new Error('Access token is required for Meta Ads API');
    }
    this.accessToken = apiKey.access_token;
  }

  /**
   * Get Facebook Ad Accounts
   */
  async getAdAccounts(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/adaccounts?access_token=${this.accessToken}&fields=name,account_id,account_status,currency`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ad accounts: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching Meta Ad Accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Campaigns for an Ad Account
   */
  async getCampaigns(adAccountId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/act_${adAccountId}/campaigns?access_token=${this.accessToken}&fields=name,status,effective_status`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching Meta Campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(adAccountId: string, campaignData: any): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/act_${adAccountId}/campaigns?access_token=${this.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: campaignData.name,
            status: campaignData.status || 'PAUSED',
            objective: campaignData.objective,
            ...campaignData
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to create campaign: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error creating Meta Campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send conversion event to Conversions API
   */
  async sendConversionEvent(eventData: any): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/<PIXEL_ID>/events?access_token=${this.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to send conversion event: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Error sending Meta Conversion Event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
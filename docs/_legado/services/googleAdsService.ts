// src/services/googleAdsService.ts
import { ApiKey } from '@/types/apiKeys';

export class GoogleAdsService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private developerToken: string;
  private baseUrl = 'https://googleads.googleapis.com/v16';

  constructor(apiKey: ApiKey) {
    if (!apiKey.api_key) {
      throw new Error('Client ID is required for Google Ads API');
    }
    if (!apiKey.api_secret) {
      throw new Error('Client Secret is required for Google Ads API');
    }
    if (!apiKey.refresh_token) {
      throw new Error('Refresh Token is required for Google Ads API');
    }
    
    this.clientId = apiKey.api_key;
    this.clientSecret = apiKey.api_secret;
    this.refreshToken = apiKey.refresh_token;
    // In a real implementation, you would get the developer token from environment variables
    this.developerToken = import.meta.env.VITE_GOOGLE_ADS_DEVELOPER_TOKEN || '';
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh access token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new Error(`Error refreshing Google Ads access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Google Ads accounts (accessible customers)
   */
  async getAccessibleCustomers(): Promise<any> {
    try {
      const accessToken = await this.refreshAccessToken();
      
      const response = await fetch(`${this.baseUrl}/customers:listAccessibleCustomers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accessible customers: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching Google Ads customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get campaigns for a specific customer
   */
  async getCampaigns(customerId: string): Promise<any> {
    try {
      const accessToken = await this.refreshAccessToken();
      
      const query = `
        SELECT 
          campaign.id, 
          campaign.name, 
          campaign.status,
          campaign.serving_status,
          campaign.advertising_channel_type
        FROM campaign
        ORDER BY campaign.id
      `;

      const response = await fetch(`${this.baseUrl}/customers/${customerId}/googleAds:searchStream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching Google Ads campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(customerId: string, campaignData: any): Promise<any> {
    try {
      const accessToken = await this.refreshAccessToken();
      
      const response = await fetch(`${this.baseUrl}/customers/${customerId}/campaigns:create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign: {
            name: campaignData.name,
            advertising_channel_type: campaignData.advertising_channel_type || 'SEARCH',
            status: campaignData.status || 'PAUSED',
            ...campaignData
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create campaign: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error creating Google Ads campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get metrics for campaigns
   */
  async getCampaignMetrics(customerId: string, dateRange: { start: string; end: string }): Promise<any> {
    try {
      const accessToken = await this.refreshAccessToken();
      
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM campaign
        WHERE segments.date BETWEEN '${dateRange.start}' AND '${dateRange.end}'
        ORDER BY segments.date DESC
      `;

      const response = await fetch(`${this.baseUrl}/customers/${customerId}/googleAds:searchStream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch campaign metrics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching Google Ads campaign metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
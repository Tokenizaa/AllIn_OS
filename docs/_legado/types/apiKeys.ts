// src/types/apiKeys.ts
export interface ApiKey {
  id: string;
  store_id: string;
  platform: 'meta_ads' | 'google_ads';
  api_key: string;
  api_secret?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyFormData {
  platform: 'meta_ads' | 'google_ads';
  api_key: string;
  api_secret?: string;
  access_token?: string;
  refresh_token?: string;
  name?: string;
  description?: string;
}
// Export central de todos os tipos da Maxx API

export * from './auth';
export * from './customer';
export * from './order';
export * from './product';

// Tipos comuns
export interface MaxxApiResponse<T = any> {
  error: number;
  item?: T;
  items?: T[];
  msg?: string;
}

export interface MaxxApiRequest {
  module: 'api';
  controller: string;
  action: string;
  token: string;
  [key: string]: any;
}

export interface MaxxXmlRequest {
  api: {
    request: MaxxApiRequest;
  };
}

export interface MaxxXmlResponse<T = any> {
  api: {
    response: MaxxApiResponse<T>;
  };
}

// Tipos de erro genéricos
export interface MaxxError {
  code: number;
  message: string;
  details?: any;
}

// Tipos de sincronização
export interface MaxxSyncStatus {
  lastSync: Date;
  status: 'success' | 'error' | 'pending';
  recordsProcessed: number;
  errors: string[];
}

export interface MaxxSyncLog {
  id: string;
  timestamp: Date;
  type: 'customers' | 'orders' | 'products';
  status: 'success' | 'error';
  recordsProcessed: number;
  errors?: string[];
  duration: number;
}

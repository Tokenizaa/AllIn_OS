// Serviço de autenticação da Maxx API

import { 
  MaxxAuthRequest, 
  MaxxAuthResponse, 
  MaxxSession, 
  MaxxApiConfig,
  MAXX_AUTH_ERRORS 
} from './types';
import { MaxxApiError } from './utils/errorHandler';
import { parseRequestToXml, parseXmlResponse } from './utils/xmlParser';
import { handleMaxxApiError, handleNetworkError } from './utils/errorHandler';

export class MaxxAuthService {
  private static instance: MaxxAuthService;
  private session: MaxxSession | null = null;
  private config: MaxxApiConfig;

  private constructor() {
    this.config = {
      apiUrl: '/api/maxx-proxy',
      login: import.meta.env.VITE_MAXX_API_LOGIN || 'testApi',
      module: import.meta.env.VITE_MAXX_API_MODULE || 'default',
      timeout: parseInt(import.meta.env.VITE_MAXX_API_TIMEOUT) || 30000,
      syncInterval: parseInt(import.meta.env.VITE_MAXX_SYNC_INTERVAL) || 300000
    };
  }

  public static getInstance(): MaxxAuthService {
    if (!MaxxAuthService.instance) {
      MaxxAuthService.instance = new MaxxAuthService();
    }
    return MaxxAuthService.instance;
  }

  /**
   * Realiza autenticação na Maxx API
   */
  public async authenticate(): Promise<MaxxSession> {
    try {
      // Verifica se já existe uma sessão válida
      if (this.session && this.session.isAuthenticated && this.session.expiresAt > new Date()) {
        return this.session;
      }

      const authRequest: MaxxAuthRequest = {
        controller: 'login',
        action: 'authapiuser',
        login: this.config.login,
        module: this.config.module
      };

      const xmlRequest = parseRequestToXml({ module: 'api', ...authRequest });
      
      const response = await this.makeRequest(xmlRequest);
      const xmlResponse = parseXmlResponse<MaxxAuthResponse>(response);
      
      if (xmlResponse.api.response.error !== 0) {
        throw handleMaxxApiError(xmlResponse.api.response.error, 'Authentication');
      }

      if (!xmlResponse.api.response.token) {
        throw new MaxxApiError(-1, 'Token não recebido da API', 'auth');
      }

      // Cria sessão com expiração de 4 horas
      this.session = {
        token: xmlResponse.api.response.token,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas
        isAuthenticated: true
      };

      return this.session;
    } catch (error) {
      if (error instanceof MaxxApiError) {
        throw error;
      }
      throw handleNetworkError(error, 'Authentication');
    }
  }

  /**
   * Retorna o token atual ou null se não estiver autenticado
   */
  public getToken(): string | null {
    if (!this.session || !this.session.isAuthenticated || this.session.expiresAt <= new Date()) {
      return null;
    }
    return this.session.token;
  }

  /**
   * Verifica se está autenticado
   */
  public isAuthenticated(): boolean {
    return this.session !== null && 
           this.session.isAuthenticated && 
           this.session.expiresAt > new Date();
  }

  /**
   * Faz logout da sessão atual
   */
  public logout(): void {
    this.session = null;
  }

  /**
   * Renova a sessão atual
   */
  public async refreshToken(): Promise<MaxxSession> {
    this.session = null;
    return this.authenticate();
  }

  /**
   * Faz requisição HTTP para a Maxx API
   */
  private async makeRequest(xmlData: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.apiUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        body: xmlData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      
      if (!responseText.trim()) {
        throw new Error('Resposta vazia da API');
      }

      return responseText;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Obtém configuração atual
   */
  public getConfig(): MaxxApiConfig {
    return { ...this.config };
  }

  /**
   * Atualiza configuração
   */
  public updateConfig(newConfig: Partial<MaxxApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Retorna informações da sessão atual para debug
   */
  public getSessionInfo(): {
    isAuthenticated: boolean;
    tokenPreview?: string;
    expiresAt?: Date;
    timeToExpiry?: number;
  } {
    if (!this.session) {
      return { isAuthenticated: false };
    }

    const timeToExpiry = this.session.expiresAt.getTime() - Date.now();
    
    return {
      isAuthenticated: this.isAuthenticated(),
      tokenPreview: this.session.token ? `${this.session.token.substring(0, 8)}...` : undefined,
      expiresAt: this.session.expiresAt,
      timeToExpiry: timeToExpiry > 0 ? timeToExpiry : 0
    };
  }
}

// Export singleton instance
export const maxxAuthService = MaxxAuthService.getInstance();

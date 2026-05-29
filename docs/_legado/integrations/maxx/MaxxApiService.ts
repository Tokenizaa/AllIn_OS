// Serviço principal de comunicação com a Maxx API

import { 
  MaxxApiRequest, 
  MaxxApiResponse, 
  MaxxXmlRequest, 
  MaxxXmlResponse
} from './types';
import { MaxxApiError } from './utils/errorHandler';
import { parseRequestToXml, parseXmlResponse } from './utils/xmlParser';
import { maxxAuthService } from './MaxxAuthService';
import { 
  handleMaxxApiError, 
  handleNetworkError, 
  validateApiResponse,
  isRecoverableError,
  calculateRetryDelay 
} from './utils/errorHandler';

export class MaxxApiService {
  private static instance: MaxxApiService;
  private authService = maxxAuthService;
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

  public static getInstance(): MaxxApiService {
    if (!MaxxApiService.instance) {
      MaxxApiService.instance = new MaxxApiService();
    }
    return MaxxApiService.instance;
  }

  /**
   * Faz requisição genérica para a Maxx API com retry automático
   */
  public async makeRequest<T = any>(
    request: MaxxApiRequest,
    maxRetries: number = 3
  ): Promise<MaxxApiResponse<T>> {
    let lastError: Error | MaxxApiError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Garante autenticação
        await this.authService.authenticate();
        const token = this.authService.getToken();
        
        if (!token) {
          throw new MaxxApiError(-1, 'Token de autenticação não disponível', 'auth');
        }

        // Adiciona token à requisição
        const authenticatedRequest: MaxxApiRequest = {
          ...request,
          token
        };

        // Converte para XML
        const xmlRequest = parseRequestToXml(authenticatedRequest);
        
        // Faz requisição HTTP
        const response = await this.makeHttpRequest(xmlRequest);
        
        // Parse da resposta
        const xmlResponse = parseXmlResponse<T>(response);
        
        // Valida resposta
        const validationError = validateApiResponse(xmlResponse.api.response);
        if (validationError) {
          throw validationError;
        }

        return xmlResponse.api.response;
      } catch (error) {
        lastError = error instanceof MaxxApiError ? error : handleNetworkError(error);

        // Se não for recuperável ou última tentativa, lança erro
        if (!isRecoverableError(lastError as MaxxApiError) || attempt === maxRetries) {
          throw lastError;
        }

        // Espera antes de tentar novamente
        const delay = calculateRetryDelay(attempt);
        await this.sleep(delay);
        
        console.warn(`Tentativa ${attempt} falhou, tentando novamente em ${delay}ms...`);
      }
    }

    throw lastError!;
  }

  /**
   * Faz requisição HTTP
   */
  private async makeHttpRequest(xmlData: string): Promise<string> {
    const config = this.authService.getConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${config.apiUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
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
   * Utilitário para sleep/await
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica status da conexão
   */
  public async checkConnection(): Promise<boolean> {
    try {
      await this.authService.authenticate();
      return true;
    } catch (error) {
      console.error('Erro na conexão com Maxx API:', error);
      return false;
    }
  }

  /**
   * Obtém informações da sessão atual
   */
  public getSessionInfo() {
    return this.authService.getSessionInfo();
  }

  /**
   * Força renovação do token
   */
  public async refreshToken() {
    return this.authService.refreshToken();
  }

  /**
   * Faz logout
   */
  public logout() {
    this.authService.logout();
  }
}

// Export singleton instance
export const maxxApiService = MaxxApiService.getInstance();

// Utilitário para tratamento de erros da Maxx API

import { MAXX_AUTH_ERRORS, MaxxError, MaxxSyncLog } from '../types';

export class MaxxApiError extends Error {
  public readonly code: number;
  public readonly type: 'auth' | 'api' | 'network' | 'validation' | 'sync';
  public readonly details?: any;

  constructor(
    code: number,
    message: string,
    type: MaxxApiError['type'] = 'api',
    details?: any
  ) {
    super(message);
    this.name = 'MaxxApiError';
    this.code = code;
    this.type = type;
    this.details = details;
  }
}

/**
 * Trata erros da API Maxx baseado no código de erro
 */
export function handleMaxxApiError(errorCode: number, context?: string): MaxxApiError {
  const message = MAXX_AUTH_ERRORS[errorCode] || 'Erro desconhecido da API';
  
  // Determina o tipo de erro baseado no código
  let type: MaxxApiError['type'] = 'api';
  
  if (errorCode === 1 || errorCode === 4 || errorCode === 5) {
    type = 'auth';
  } else if (errorCode === 2) {
    type = 'validation';
  } else if (errorCode === 0) {
    type = 'network';
  }

  return new MaxxApiError(
    errorCode,
    `${context ? `[${context}] ` : ''}${message}`,
    type,
    { originalCode: errorCode }
  );
}

/**
 * Trata erros de rede/conexão
 */
export function handleNetworkError(error: any, context?: string): MaxxApiError {
  if (error.name === 'AbortError') {
    return new MaxxApiError(
      -1,
      `${context ? `[${context}] ` : ''}Timeout da requisição`,
      'network',
      { originalError: error }
    );
  }

  if (error.code === 'ECONNREFUSED') {
    return new MaxxApiError(
      -2,
      `${context ? `[${context}] ` : ''}Conexão recusada - servidor indisponível`,
      'network',
      { originalError: error }
    );
  }

  if (error.code === 'ENOTFOUND') {
    return new MaxxApiError(
      -3,
      `${context ? `[${context}] ` : ''}Servidor não encontrado`,
      'network',
      { originalError: error }
    );
  }

  return new MaxxApiError(
    -999,
    `${context ? `[${context}] ` : ''}Erro de rede: ${error.message}`,
    'network',
    { originalError: error }
  );
}

/**
 * Trata erros de parsing de XML
 */
export function handleXmlError(error: any, xmlContent?: string): MaxxApiError {
  return new MaxxApiError(
    -100,
    `Erro ao processar XML: ${error.message}`,
    'validation',
    { 
      originalError: error,
      xmlPreview: xmlContent ? xmlContent.substring(0, 200) + '...' : undefined
    }
  );
}

/**
 * Trata erros de sincronização
 */
export function handleSyncError(
  error: any, 
  syncType: 'customers' | 'orders' | 'products',
  recordId?: string
): MaxxApiError {
  const context = `Sync ${syncType}${recordId ? ` (${recordId})` : ''}`;
  
  if (error instanceof MaxxApiError) {
    return new MaxxApiError(
      error.code,
      `${context}: ${error.message}`,
      'sync',
      { ...error.details, syncType, recordId }
    );
  }

  return new MaxxApiError(
    -200,
    `${context}: ${error.message}`,
    'sync',
    { originalError: error, syncType, recordId }
  );
}

/**
 * Formata mensagem de erro para logging
 */
export function formatErrorLog(error: MaxxApiError): string {
  const parts = [
    `[${error.type.toUpperCase()}]`,
    `Code: ${error.code}`,
    `Message: ${error.message}`
  ];

  if (error.details) {
    parts.push(`Details: ${JSON.stringify(error.details)}`);
  }

  return parts.join(' | ');
}

/**
 * Determina se o erro é recuperável (pode tentar novamente)
 */
export function isRecoverableError(error: MaxxApiError): boolean {
  // Erros de rede e timeout geralmente são recuperáveis
  if (error.type === 'network') {
    return true;
  }

  // Erros de sistema (código 0) podem ser temporários
  if (error.code === 0) {
    return true;
  }

  // Erros de autenticação podem ser recuperáveis com refresh de token
  if (error.type === 'auth' && [4, 5].includes(error.code)) {
    return true;
  }

  // Outros erros geralmente não são recuperáveis
  return false;
}

/**
 * Calcula tempo de espera para retry (exponential backoff)
 */
export function calculateRetryDelay(attemptNumber: number, baseDelay: number = 1000): number {
  const maxDelay = 30000; // 30 segundos máximo
  const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
  const jitter = Math.random() * 0.1 * exponentialDelay; // 10% de jitter
  
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Cria log de sincronização com erro
 */
export function createSyncErrorLog(
  syncType: 'customers' | 'orders' | 'products',
  error: MaxxApiError,
  startTime: number
): MaxxSyncLog {
  return {
    id: `${syncType}_${Date.now()}`,
    timestamp: new Date(),
    type: syncType,
    status: 'error',
    recordsProcessed: 0,
    errors: [formatErrorLog(error)],
    duration: Date.now() - startTime
  };
}

/**
 * Valida resposta da API
 */
export function validateApiResponse(response: any): MaxxApiError | null {
  if (!response) {
    return new MaxxApiError(
      -300,
      'Resposta vazia da API',
      'validation'
    );
  }

  if (typeof response !== 'object') {
    return new MaxxApiError(
      -301,
      'Resposta inválida - esperado objeto',
      'validation',
      { receivedType: typeof response }
    );
  }

  if (response.error === undefined) {
    return new MaxxApiError(
      -302,
      'Resposta não contém campo de erro',
      'validation'
    );
  }

  if (response.error !== 0) {
    return handleMaxxApiError(response.error);
  }

  return null;
}

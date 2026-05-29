// Middleware para tratamento de CORS em produção

/**
 * Headers CORS para produção
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

/**
 * Verifica se CORS está habilitado
 */
export const isCorsEnabled = (): boolean => {
  return import.meta.env.__CORS_ENABLED__ === 'true';
};

/**
 * Adiciona headers CORS à resposta
 */
export const addCorsHeaders = (response: Response): Response => {
  if (!isCorsEnabled()) {
    return response;
  }

  // Clona a resposta para poder modificar headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      ...CORS_HEADERS
    }
  });

  return newResponse;
};

/**
 * Intercepta fetch global para adicionar CORS
 */
export const setupCorsInterceptor = () => {
  if (!isCorsEnabled()) {
    return;
  }

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Se for uma requisição para a API Maxx, adiciona CORS
    if (typeof input === 'string' && input.includes('allinbrasil.maxxmultinivel.com.br')) {
      const response = await originalFetch(input, init);
      return addCorsHeaders(response);
    }

    // Para outras requisições, mantém comportamento normal
    return originalFetch(input, init);
  };
};

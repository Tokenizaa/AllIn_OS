// Tipos para autenticação da Maxx API

export interface MaxxAuthRequest {
  controller: 'login';
  action: 'authapiuser';
  login: string;
  module: string;
}

export interface MaxxAuthResponse {
  error: number;
  token?: string;
  msg?: string;
}

export interface MaxxAuthError {
  code: number;
  message: string;
  description: string;
}

export const MAXX_AUTH_ERRORS: Record<number, string> = {
  0: 'Erro do sistema',
  1: 'Usuário não encontrado',
  2: 'Parâmetros incorretos',
  3: 'Dados não encontrados',
  4: 'Sessão expirada',
  5: 'Token inválido',
  6: 'Método HTTP incorreto'
};

export interface MaxxApiConfig {
  apiUrl: string;
  login: string;
  module: string;
  timeout: number;
  syncInterval: number;
}

export interface MaxxSession {
  token: string;
  expiresAt: Date;
  isAuthenticated: boolean;
}

// Serviços especializados para endpoints da Maxx API

import { maxxApiService } from '../MaxxApiService';
import { MaxxApiRequest } from '../types';

// Interfaces para os endpoints de Cadastros
export interface CadastroListRequest {
  data_ini: string; // Data no formato Pt-Br (dd/mm/yyyy)
  token?: string;
}

export interface CadastroFindRequest {
  cod?: number;
  token?: string;
}

export interface CadastroProfileRequest {
  token?: string;
}

export interface CadastroLoginRequest {
  login: string;
  senha: string;
  token?: string;
}

export interface CadastroStatusRequest {
  cod: number;
  status: string;
  token?: string;
}

export interface Cadastro {
  cod: number;
  nome: string;
  email: string;
  cpf_cnpj: string;
  data_cadastro: string;
  status: string;
  telefone?: string;
  celular?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

// Serviço para endpoints de Cadastros (Clientes)
export class MaxxCadastrosService {
  private static instance: MaxxCadastrosService;

  private constructor() {}

  public static getInstance(): MaxxCadastrosService {
    if (!MaxxCadastrosService.instance) {
      MaxxCadastrosService.instance = new MaxxCadastrosService();
    }
    return MaxxCadastrosService.instance;
  }

  /**
   * Lista todos os cadastros a partir de uma data inicial
   * Endpoint: /api/cadastros/list
   * Método: GET
   */
  public async listarCadastros(params: CadastroListRequest): Promise<{ cadastros: Cadastro[] }> {
    const request: MaxxApiRequest = {
      controller: 'cadastros',
      action: 'list',
      module: 'api',
      data_ini: params.data_ini,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ cadastros: Cadastro[] }>(request);
    return response;
  }

  /**
   * Busca um cadastro específico pelo código
   * Endpoint: /api/cadastros/find
   * Método: GET
   */
  public async buscarCadastro(params: CadastroFindRequest): Promise<{ cadastro: Cadastro }> {
    const request: MaxxApiRequest = {
      controller: 'cadastros',
      action: 'find',
      module: 'api',
      cod: params.cod,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ cadastro: Cadastro }>(request);
    return response;
  }

  /**
   * Obtém o perfil do cadastro logado
   * Endpoint: /api/cadastros/profile
   * Método: GET
   */
  public async obterPerfil(params: CadastroProfileRequest = {}): Promise<{ perfil: Cadastro }> {
    const request: MaxxApiRequest = {
      controller: 'cadastros',
      action: 'profile',
      module: 'api',
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ perfil: Cadastro }>(request);
    return response;
  }

  /**
   * Realiza login de um cadastro
   * Endpoint: /api/cadastros/login
   * Método: POST
   */
  public async loginCadastro(params: CadastroLoginRequest): Promise<{ sessao: any }> {
    const request: MaxxApiRequest = {
      controller: 'cadastros',
      action: 'login',
      module: 'api',
      login: params.login,
      senha: params.senha,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ sessao: any }>(request);
    return response;
  }

  /**
   * Atualiza o status de um cadastro
   * Endpoint: /api/cadastros/status
   * Método: POST
   */
  public async atualizarStatus(params: CadastroStatusRequest): Promise<{ sucesso: boolean }> {
    const request: MaxxApiRequest = {
      controller: 'cadastros',
      action: 'status',
      module: 'api',
      cod: params.cod,
      status: params.status,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ sucesso: boolean }>(request);
    return response;
  }
}

// Export singleton instance
export const maxxCadastrosService = MaxxCadastrosService.getInstance();

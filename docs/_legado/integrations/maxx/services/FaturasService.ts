// Serviços especializados para endpoints de Faturas (Pedidos)

import { maxxApiService } from '../MaxxApiService';
import { MaxxApiRequest } from '../types';

// Interfaces para os endpoints de Faturas
export interface FaturaListRequest {
  data_ini: string; // Data no formato Pt-Br (dd/mm/yyyy)
  data_fim?: string; // Data final (opcional)
  token?: string;
}

export interface FaturaFindRequest {
  id_fatura: number;
  token?: string;
}

export interface FaturaDetalhesRequest {
  id_fatura: number;
  token?: string;
}

export interface Fatura {
  id_fatura: number;
  tipo: string;
  data_pedido: string;
  data_vencimento: string;
  forma_pagamento: string;
  situacao: string;
  valor_total: string;
  cliente_nome: string;
  cliente_cpf: string;
  cliente_email: string;
  itens: FaturaItem[];
}

export interface FaturaItem {
  produto: string;
  quantidade: number;
  valor_unitario: string;
  valor_total: string;
}

// Serviço para endpoints de Faturas (Pedidos)
export class MaxxFaturasService {
  private static instance: MaxxFaturasService;

  private constructor() {}

  public static getInstance(): MaxxFaturasService {
    if (!MaxxFaturasService.instance) {
      MaxxFaturasService.instance = new MaxxFaturasService();
    }
    return MaxxFaturasService.instance;
  }

  /**
   * Lista todas as faturas em um período
   * Endpoint: /api/faturas/list
   * Método: GET
   */
  public async listarFaturas(params: FaturaListRequest): Promise<{ faturas: Fatura[] }> {
    const request: MaxxApiRequest = {
      controller: 'faturas',
      action: 'list',
      module: 'api',
      data_ini: params.data_ini,
      data_fim: params.data_fim,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ faturas: Fatura[] }>(request);
    return response;
  }

  /**
   * Busca uma fatura específica pelo ID
   * Endpoint: /api/faturas/find
   * Método: GET
   */
  public async buscarFatura(params: FaturaFindRequest): Promise<{ fatura: Fatura }> {
    const request: MaxxApiRequest = {
      controller: 'faturas',
      action: 'find',
      module: 'api',
      id_fatura: params.id_fatura,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ fatura: Fatura }>(request);
    return response;
  }

  /**
   * Obtém detalhes completos de uma fatura
   * Endpoint: /api/faturas/detalhes
   * Método: GET
   */
  public async obterDetalhesFatura(params: FaturaDetalhesRequest): Promise<{ detalhes: any }> {
    const request: MaxxApiRequest = {
      controller: 'faturas',
      action: 'detalhes',
      module: 'api',
      id_fatura: params.id_fatura,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ detalhes: any }>(request);
    return response;
  }
}

// Export singleton instance
export const maxxFaturasService = MaxxFaturasService.getInstance();

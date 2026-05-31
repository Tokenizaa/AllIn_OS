// Serviços especializados para endpoints de Créditos

import { maxxApiService } from '../MaxxApiService';
import { MaxxApiRequest } from '../types';

// Interfaces para os endpoints de Créditos
export interface CreditoGetBalanceRequest {
  cod: number;
  token?: string;
}

export interface CreditoGetBalanceByIdRequest {
  token?: string;
}

export interface CreditoExtractRequest {
  cod: number;
  data_ini?: string;
  data_fim?: string;
  token?: string;
}

export interface CreditoTransferRequest {
  cod_origem: number;
  cod_destino: number;
  valor: string;
  token?: string;
}

export interface Credito {
  cod: number;
  nome: string;
  saldo_sacavel: string;
  saldo_nao_sacavel: string;
  data_ultima_movimentacao: string;
}

export interface ExtratoCredito {
  data: string;
  tipo: string;
  descricao: string;
  valor: string;
  saldo: string;
}

// Serviço para endpoints de Créditos
export class MaxxCreditosService {
  private static instance: MaxxCreditosService;

  private constructor() {}

  public static getInstance(): MaxxCreditosService {
    if (!MaxxCreditosService.instance) {
      MaxxCreditosService.instance = new MaxxCreditosService();
    }
    return MaxxCreditosService.instance;
  }

  /**
   * Obtém saldo de créditos de um cadastro específico
   * Endpoint: /api/creditos/getbalance
   * Método: GET
   */
  public async obterSaldo(params: CreditoGetBalanceRequest): Promise<{ 
    sacavel: string; 
    nao_sacavel: string; 
  }> {
    const request: MaxxApiRequest = {
      controller: 'creditos',
      action: 'getbalance',
      module: 'api',
      cod: params.cod,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ 
      sacavel: string; 
      nao_sacavel: string; 
    }>(request);
    return response;
  }

  /**
   * Obtém saldo de créditos do cadastro logado
   * Endpoint: /api/creditos/getbalancebyid
   * Método: GET
   */
  public async obterSaldoLogado(params: CreditoGetBalanceByIdRequest = {}): Promise<{ 
    sacavel: string; 
    nao_sacavel: string; 
  }> {
    const request: MaxxApiRequest = {
      controller: 'creditos',
      action: 'getbalancebyid',
      module: 'api',
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ 
      sacavel: string; 
      nao_sacavel: string; 
    }>(request);
    return response;
  }

  /**
   * Obtém extrato de créditos
   * Endpoint: /api/creditos/extract
   * Método: GET
   */
  public async obterExtrato(params: CreditoExtractRequest): Promise<{ 
    extrato: ExtratoCredito[] 
  }> {
    const request: MaxxApiRequest = {
      controller: 'creditos',
      action: 'extract',
      module: 'api',
      cod: params.cod,
      data_ini: params.data_ini,
      data_fim: params.data_fim,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ 
      extrato: ExtratoCredito[] 
    }>(request);
    return response;
  }

  /**
   * Transfere créditos entre cadastros
   * Endpoint: /api/creditos/transfer
   * Método: POST
   */
  public async transferirCreditos(params: CreditoTransferRequest): Promise<{ 
    sucesso: boolean; 
    mensagem?: string 
  }> {
    const request: MaxxApiRequest = {
      controller: 'creditos',
      action: 'transfer',
      module: 'api',
      cod_origem: params.cod_origem,
      cod_destino: params.cod_destino,
      valor: params.valor,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ 
      sucesso: boolean; 
      mensagem?: string 
    }>(request);
    return response;
  }
}

// Export singleton instance
export const maxxCreditosService = MaxxCreditosService.getInstance();

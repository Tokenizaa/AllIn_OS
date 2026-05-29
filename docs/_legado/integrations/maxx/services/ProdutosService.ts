// Serviços especializados para endpoints de Produtos

import { maxxApiService } from '../MaxxApiService';
import { MaxxApiRequest } from '../types';

// Interfaces para os endpoints de Produtos
export interface ProdutoListRequest {
  categoria_id?: number;
  token?: string;
}

export interface ProdutoFindRequest {
  cod: number;
  token?: string;
}

export interface Produto {
  cod: number;
  nome: string;
  descricao: string;
  categoria: string;
  valor: string;
  comissao: string;
  estoque: number;
  imagem?: string;
  status: string;
  data_cadastro: string;
}

// Serviço para endpoints de Produtos
export class MaxxProdutosService {
  private static instance: MaxxProdutosService;

  private constructor() {}

  public static getInstance(): MaxxProdutosService {
    if (!MaxxProdutosService.instance) {
      MaxxProdutosService.instance = new MaxxProdutosService();
    }
    return MaxxProdutosService.instance;
  }

  /**
   * Lista todos os produtos
   * Endpoint: /api/produtos/list
   * Método: GET
   */
  public async listarProdutos(params: ProdutoListRequest = {}): Promise<{ produtos: Produto[] }> {
    const request: MaxxApiRequest = {
      controller: 'produtos',
      action: 'list',
      module: 'api',
      categoria_id: params.categoria_id,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ produtos: Produto[] }>(request);
    return response;
  }

  /**
   * Busca um produto específico pelo código
   * Endpoint: /api/produtos/find
   * Método: GET
   */
  public async buscarProduto(params: ProdutoFindRequest): Promise<{ produto: Produto }> {
    const request: MaxxApiRequest = {
      controller: 'produtos',
      action: 'find',
      module: 'api',
      cod: params.cod,
      token: params.token
    };

    const response = await maxxApiService.makeRequest<{ produto: Produto }>(request);
    return response;
  }
}

// Export singleton instance
export const maxxProdutosService = MaxxProdutosService.getInstance();

// Tipos para produtos da Maxx API

export interface MaxxProduct {
  id: number;
  id_categoria: number;
  categoria: string;
  nome: string;
  descricao: string;
  peso: string;
  pontos: string;
  valor: string;
  ativo: 'sim' | 'não';
  codigo?: string;
  kit: 'sim' | 'não';
  especificacoes?: string;
  endereco_loja: string;
  endereco_imagem?: string;
  endereco_categoria: string;
}

export interface MaxxProductRequest {
  module: 'api';
  controller: 'produtos';
  action: 'list' | 'find' | 'insert' | 'update';
  token: string;
  cod?: number; // Para action=find
  // Campos adicionais para insert/update
  id_categoria?: number;
  nome?: string;
  descricao?: string;
  peso?: string;
  pontos?: string;
  valor?: string;
  ativo?: 'sim' | 'não';
  codigo?: string;
  kit?: 'sim' | 'não';
  especificacoes?: string;
}

export interface MaxxProductListResponse {
  error: number;
  item?: MaxxProduct[];
}

export interface MaxxProductFindResponse {
  error: number;
  item?: MaxxProduct;
}

export interface MaxxProductInsertResponse {
  error: number;
  msg?: string;
  id?: number;
}

export interface MaxxProductUpdateResponse {
  error: number;
  msg?: string;
}

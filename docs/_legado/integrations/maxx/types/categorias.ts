// Tipos para categorias da Maxx API

export interface MaxxCategoria {
  id: number;
  categoria: string;
  ativo: number;
  id_categoria_pai: number;
  categoria_pai?: string;
  endereco_categoria: string;
}

export interface MaxxCategoriaRequest {
  module: 'api';
  controller: 'categorias';
  action: 'list' | 'find' | 'insert' | 'update';
  token: string;
  cod?: number; // Para action=find
  // Campos adicionais para insert/update
  id_categoria_pai?: number;
  categoria?: string;
  ativo?: number;
}

export interface MaxxCategoriaListResponse {
  error: number;
  item?: MaxxCategoria[];
}

export interface MaxxCategoriaFindResponse {
  error: number;
  item?: MaxxCategoria;
}

export interface MaxxCategoriaInsertResponse {
  error: number;
  msg?: string;
  id?: number;
}

export interface MaxxCategoriaUpdateResponse {
  error: number;
  msg?: string;
}

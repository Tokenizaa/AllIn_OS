// Tipos para pedidos/faturas da Maxx API

export interface MaxxOrder {
  id: number;
  data_fatura: string;
  data_vencimento: string;
  data_baixa?: string;
  data_pagamento?: string;
  tipo: string;
  confirmado: number;
  valor: string;
  valor_frete: string;
  valor_desconto: string;
  valor_creditos: string;
  codigo?: string;
  id_cdr?: string;
  origem_baixa?: string;
  data_cancelamento?: string;
  id_cadastro_entrega?: number;
  memo?: string;
  status_entrega?: string;
  codigo_rastreio?: string;
  id_cadastro: number;
  id_consumidor: number;
  peso_total: string;
  tipo_envio?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  destinatario: string;
}

export interface MaxxOrderItem {
  id: number;
  id_produto: number;
  nome_produto: string;
  quantidade: number;
  valor_total: string;
  valor_unidade: string;
  codigo?: string;
  sku?: string;
}

export interface MaxxOrderRequest {
  module: 'api';
  controller: 'faturas';
  action: 'list' | 'find' | 'update' | 'confirm' | 'cancel';
  token: string;
  cod?: number; // Para action=find
  id_cadastro?: number; // Parâmetro opcional para action=list
}

export interface MaxxOrderItemsRequest {
  module: 'api';
  controller: 'faturascdr';
  action: 'getitems';
  token: string;
  cod: number; // ID da fatura
}

export interface MaxxOrderListResponse {
  error: number;
  item?: MaxxOrder[];
}

export interface MaxxOrderFindResponse {
  error: number;
  item?: MaxxOrder;
}

export interface MaxxOrderItemsResponse {
  error: number;
  item?: MaxxOrderItem[];
}

export interface MaxxOrderUpdateRequest {
  module: 'api';
  controller: 'faturas';
  action: 'update' | 'updateopl';
  token: string;
  cod: number;
  // Campos adicionais para update
  [key: string]: any;
}

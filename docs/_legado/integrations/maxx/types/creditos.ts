// Tipos para créditos da Maxx API

export interface MaxxCredito {
  id: number;
  id_cadastro: number;
  valor_solicitado: number;
  data_solicitacao: string;
  tipo_solicitacao: number;
  data_baixa?: string;
  log?: string;
  recusado?: string;
  data_recusa?: string;
  valor: number;
  tipo_cadastro: number;
  numero_documento?: string;
  nome_favorecido?: string;
  nome_empresa?: string;
  cnpj?: string;
  codigo_banco_favorecido?: number;
  conta_favorecido?: string;
  dv_conta_favorecido?: string;
  agencia_favorecido?: string;
  dv_agencia_favorecido?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  tipo_conta: number;
  cpf_conta?: string;
}

export interface MaxxBalance {
  nao_sacavel: string;
  sacavel: string;
}

export interface MaxxCreditoRequest {
  module: 'api';
  controller: 'creditos';
  action: 'list' | 'request' | 'approve' | 'reject' | 'getbalance' | 'getbalancebyid';
  token: string;
  ano?: number; // Para action=list
  mes?: number; // Para action=list
  situacao?: number; // Para action=list (0=aberta, 1=confirmada, 2=recusada)
  cod?: number; // Para action=getbalance, approve, reject
  valor?: number; // Para action=request
}

export interface MaxxCreditoListResponse {
  error: number;
  item?: MaxxCredito[];
}

export interface MaxxBalanceResponse {
  error: number;
  nao_sacavel?: string;
  sacavel?: string;
}

export interface MaxxCreditoActionResponse {
  error: number;
  msg?: string;
}

export enum MaxxCreditoStatus {
  ABERTA = 0,
  CONFIRMADA = 1,
  RECUSADA = 2,
}

export enum MaxxCreditoTipoSolicitacao {
  SAQUE = 0,
  TRANSFERENCIA = 1,
}

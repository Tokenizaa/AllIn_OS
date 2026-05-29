// Tipos para clientes/cadastros da Maxx API

export interface MaxxCustomer {
  login: string;
  id: number;
  tipo_cadastro: number;
  nome: string;
  logradouro?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  email: string;
  email_alternativo?: string;
  telefone_residencial?: string;
  telefone_celular?: string;
  operadora?: string;
  melhor_operadora_regiao?: string;
  sexo: 'M' | 'F';
  cpf?: string;
  cnpj?: string;
  inscricao_estadual?: string;
  nome_empresa?: string;
  rg?: string;
  data_nascimento: string;
  cod_banco?: string;
  agencia?: string;
  tipo_conta: number;
  conta?: string;
  cpf_conta?: string;
  operacao: number;
  variacao: number;
  data_cadastro: string;
  indicante_id: number;
  data_ativacao: string;
  id_nivel: number;
  ip_cadastro?: string;
  pais: string;
  cancelado: number;
}

export interface MaxxCustomerRequest {
  module: 'api';
  controller: 'cadastros';
  action: 'list' | 'find' | 'profile' | 'login' | 'status';
  token: string;
  cod?: number; // Para action=find
}

export interface MaxxCustomerResponse {
  error: number;
  item?: MaxxCustomer;
  items?: MaxxCustomer[];
}

export interface MaxxCustomerListResponse {
  error: number;
  item?: MaxxCustomer[];
}

export interface MaxxCustomerFindResponse {
  error: number;
  item?: MaxxCustomer;
}

export interface MaxxCustomerProfileResponse {
  error: number;
  login: string;
  id: number;
  tipo: number;
  nome: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  email: string;
  telefone?: string;
  sexo: 'M' | 'F';
  cpf?: string;
  cnpj?: string;
  data_nascimento: string;
  data_cadastro: string;
  id_loja: number;
  saldo_creditos: number;
}

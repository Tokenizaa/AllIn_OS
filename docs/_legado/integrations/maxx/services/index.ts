// Export unificado de todos os serviços da Maxx API

export { MaxxCadastrosService, maxxCadastrosService } from './CadastrosService';
export { MaxxFaturasService, maxxFaturasService } from './FaturasService';
export { MaxxProdutosService, maxxProdutosService } from './ProdutosService';
export { MaxxCreditosService, maxxCreditosService } from './CreditosService';

// Export das interfaces
export type {
  CadastroListRequest,
  CadastroFindRequest,
  CadastroProfileRequest,
  CadastroLoginRequest,
  CadastroStatusRequest,
  Cadastro
} from './CadastrosService';

export type {
  FaturaListRequest,
  FaturaFindRequest,
  FaturaDetalhesRequest,
  Fatura,
  FaturaItem
} from './FaturasService';

export type {
  ProdutoListRequest,
  ProdutoFindRequest,
  Produto
} from './ProdutosService';

export type {
  CreditoGetBalanceRequest,
  CreditoGetBalanceByIdRequest,
  CreditoExtractRequest,
  CreditoTransferRequest,
  Credito,
  ExtratoCredito
} from './CreditosService';

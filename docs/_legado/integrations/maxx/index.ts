// Export principal do módulo Maxx API

export * from './types';
export * from './utils/xmlParser';
export { MaxxApiError, handleMaxxApiError, handleNetworkError, validateApiResponse, isRecoverableError, calculateRetryDelay } from './utils/errorHandler';
export { MaxxAuthService, maxxAuthService } from './MaxxAuthService';
export { MaxxApiService, maxxApiService } from './MaxxApiService';

// Export dos serviços especializados
export {
  MaxxCadastrosService,
  maxxCadastrosService,
  MaxxFaturasService,
  maxxFaturasService,
  MaxxProdutosService,
  maxxProdutosService,
  MaxxCreditosService,
  maxxCreditosService
} from './services';

// Export das interfaces
export type {
  MaxxApiRequest,
  MaxxApiResponse,
  MaxxXmlRequest,
  MaxxXmlResponse,
  MaxxApiConfig
} from './types';

export type {
  CadastroListRequest,
  CadastroFindRequest,
  CadastroProfileRequest,
  CadastroLoginRequest,
  CadastroStatusRequest,
  Cadastro,
  FaturaListRequest,
  FaturaFindRequest,
  FaturaDetalhesRequest,
  Fatura,
  FaturaItem,
  ProdutoListRequest,
  ProdutoFindRequest,
  Produto,
  CreditoGetBalanceRequest,
  CreditoGetBalanceByIdRequest,
  CreditoExtractRequest,
  CreditoTransferRequest,
  Credito,
  ExtratoCredito
} from './services';

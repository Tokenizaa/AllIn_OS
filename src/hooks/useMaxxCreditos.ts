// Hook React para consumir endpoints de Créditos da Maxx API
import { useState, useEffect, useCallback } from 'react';
import { 
  maxxCreditosService, 
  CreditoGetBalanceRequest,
  CreditoGetBalanceByIdRequest,
  CreditoExtractRequest,
  CreditoTransferRequest,
  Credito,
  ExtratoCredito
} from '@/integrations/maxx/services';

export interface UseMaxxCreditosReturn {
  saldo: { sacavel: string; nao_sacavel: string } | null;
  extrato: ExtratoCredito[];
  loading: boolean;
  error: string | null;
  transferResult: { sucesso: boolean; mensagem?: string } | null;
  
  // Métodos
  obterSaldo: (params: CreditoGetBalanceRequest) => Promise<void>;
  obterSaldoLogado: (params?: CreditoGetBalanceByIdRequest) => Promise<void>;
  obterExtrato: (params: CreditoExtractRequest) => Promise<void>;
  transferirCreditos: (params: CreditoTransferRequest) => Promise<void>;
  
  // Utilitarios
  limparErro: () => void;
  limparResultados: () => void;
}

export function useMaxxCreditos(): UseMaxxCreditosReturn {
  const [saldo, setSaldo] = useState<{ sacavel: string; nao_sacavel: string } | null>(null);
  const [extrato, setExtrato] = useState<ExtratoCredito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferResult, setTransferResult] = useState<{ sucesso: boolean; mensagem?: string } | null>(null);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparResultados = useCallback(() => {
    setSaldo(null);
    setExtrato([]);
    setTransferResult(null);
  }, []);

  const obterSaldo = useCallback(async (params: CreditoGetBalanceRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCreditosService.obterSaldo(params);
      setSaldo(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter saldo');
      console.error('Erro ao obter saldo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterSaldoLogado = useCallback(async (params?: CreditoGetBalanceByIdRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCreditosService.obterSaldoLogado(params || {});
      setSaldo(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter saldo do usuário logado');
      console.error('Erro ao obter saldo do usuário logado:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterExtrato = useCallback(async (params: CreditoExtractRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCreditosService.obterExtrato(params);
      setExtrato(response.extrato);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter extrato');
      console.error('Erro ao obter extrato:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const transferirCreditos = useCallback(async (params: CreditoTransferRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCreditosService.transferirCreditos(params);
      setTransferResult(response);
      
      // Se a transferência foi bem-sucedida, atualiza o saldo
      if (response.sucesso) {
        await obterSaldo({ cod: params.cod_origem });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao transferir créditos');
      console.error('Erro ao transferir créditos:', err);
    } finally {
      setLoading(false);
    }
  }, [obterSaldo]);

  return {
    saldo,
    extrato,
    loading,
    error,
    transferResult,
    obterSaldo,
    obterSaldoLogado,
    obterExtrato,
    transferirCreditos,
    limparErro,
    limparResultados
  };
}

// Hook React para consumir endpoints de Faturas da Maxx API
import { useState, useEffect, useCallback } from 'react';
import { 
  maxxFaturasService, 
  FaturaListRequest,
  FaturaFindRequest,
  FaturaDetalhesRequest,
  Fatura,
  FaturaItem
} from '@/integrations/maxx/services';

export interface UseMaxxFaturasReturn {
  faturas: Fatura[];
  fatura: Fatura | null;
  detalhes: any;
  loading: boolean;
  error: string | null;
  
  // Métodos
  listarFaturas: (params: FaturaListRequest) => Promise<void>;
  buscarFatura: (params: FaturaFindRequest) => Promise<void>;
  obterDetalhesFatura: (params: FaturaDetalhesRequest) => Promise<void>;
  
  // Utilitários
  limparErro: () => void;
  limparFatura: () => void;
}

export function useMaxxFaturas(): UseMaxxFaturasReturn {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [fatura, setFatura] = useState<Fatura | null>(null);
  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparFatura = useCallback(() => {
    setFatura(null);
    setDetalhes(null);
  }, []);

  const listarFaturas = useCallback(async (params: FaturaListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxFaturasService.listarFaturas(params);
      setFaturas(response.faturas);
    } catch (err: any) {
      setError(err.message || 'Erro ao listar faturas');
      console.error('Erro ao listar faturas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarFatura = useCallback(async (params: FaturaFindRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxFaturasService.buscarFatura(params);
      setFatura(response.fatura);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar fatura');
      console.error('Erro ao buscar fatura:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterDetalhesFatura = useCallback(async (params: FaturaDetalhesRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxFaturasService.obterDetalhesFatura(params);
      setDetalhes(response.detalhes);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter detalhes da fatura');
      console.error('Erro ao obter detalhes da fatura:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    faturas,
    fatura,
    detalhes,
    loading,
    error,
    listarFaturas,
    buscarFatura,
    obterDetalhesFatura,
    limparErro,
    limparFatura
  };
}

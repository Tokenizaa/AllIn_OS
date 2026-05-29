// Hook React para consumir endpoints de Produtos da Maxx API
import { useState, useEffect, useCallback } from 'react';
import { 
  maxxProdutosService, 
  ProdutoListRequest,
  ProdutoFindRequest,
  Produto
} from '@/integrations/maxx/services';

export interface UseMaxxProdutosReturn {
  produtos: Produto[];
  produto: Produto | null;
  loading: boolean;
  error: string | null;
  
  // Métodos
  listarProdutos: (params?: ProdutoListRequest) => Promise<void>;
  buscarProduto: (params: ProdutoFindRequest) => Promise<void>;
  
  // Utilitarios
  limparErro: () => void;
  limparProduto: () => void;
}

export function useMaxxProdutos(): UseMaxxProdutosReturn {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparProduto = useCallback(() => {
    setProduto(null);
  }, []);

  const listarProdutos = useCallback(async (params?: ProdutoListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxProdutosService.listarProdutos(params || {});
      setProdutos(response.produtos);
    } catch (err: any) {
      setError(err.message || 'Erro ao listar produtos');
      console.error('Erro ao listar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarProduto = useCallback(async (params: ProdutoFindRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxProdutosService.buscarProduto(params);
      setProduto(response.produto);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar produto');
      console.error('Erro ao buscar produto:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    produtos,
    produto,
    loading,
    error,
    listarProdutos,
    buscarProduto,
    limparErro,
    limparProduto
  };
}

// Hook React para consumir endpoints de Cadastros da Maxx API
import { useState, useEffect, useCallback } from 'react';
import { 
  maxxCadastrosService, 
  CadastroListRequest,
  CadastroFindRequest,
  CadastroProfileRequest,
  CadastroLoginRequest,
  CadastroStatusRequest,
  Cadastro
} from '@/integrations/maxx/services';

export interface UseMaxxCadastrosReturn {
  cadastros: Cadastro[];
  cadastro: Cadastro | null;
  loading: boolean;
  error: string | null;
  
  // Métodos
  listarCadastros: (params: CadastroListRequest) => Promise<void>;
  buscarCadastro: (params: CadastroFindRequest) => Promise<void>;
  obterPerfil: (params?: CadastroProfileRequest) => Promise<void>;
  loginCadastro: (params: CadastroLoginRequest) => Promise<any>;
  atualizarStatus: (params: CadastroStatusRequest) => Promise<void>;
  
  // Utilitários
  limparErro: () => void;
  limparCadastro: () => void;
}

export function useMaxxCadastros(): UseMaxxCadastrosReturn {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [cadastro, setCadastro] = useState<Cadastro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  const limparCadastro = useCallback(() => {
    setCadastro(null);
  }, []);

  const listarCadastros = useCallback(async (params: CadastroListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCadastrosService.listarCadastros(params);
      setCadastros(response.cadastros);
    } catch (err: any) {
      setError(err.message || 'Erro ao listar cadastros');
      console.error('Erro ao listar cadastros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarCadastro = useCallback(async (params: CadastroFindRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCadastrosService.buscarCadastro(params);
      setCadastro(response.cadastro);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar cadastro');
      console.error('Erro ao buscar cadastro:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterPerfil = useCallback(async (params?: CadastroProfileRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCadastrosService.obterPerfil(params);
      setCadastro(response.perfil);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter perfil');
      console.error('Erro ao obter perfil:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginCadastro = useCallback(async (params: CadastroLoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await maxxCadastrosService.loginCadastro(params);
      return response.sessao;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      console.error('Erro ao fazer login:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarStatus = useCallback(async (params: CadastroStatusRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await maxxCadastrosService.atualizarStatus(params);
      
      // Se temos um cadastro carregado, atualiza seu status
      if (cadastro && cadastro.cod === params.cod) {
        setCadastro({
          ...cadastro,
          status: params.status
        });
      }
      
      // Se temos a lista, atualiza o cadastro específico
      if (cadastros.length > 0) {
        setCadastros(prev => 
          prev.map(c => 
            c.cod === params.cod 
              ? { ...c, status: params.status }
              : c
          )
        );
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
      console.error('Erro ao atualizar status:', err);
    } finally {
      setLoading(false);
    }
  }, [cadastro, cadastros]);

  return {
    cadastros,
    cadastro,
    loading,
    error,
    listarCadastros,
    buscarCadastro,
    obterPerfil,
    loginCadastro,
    atualizarStatus,
    limparErro,
    limparCadastro
  };
}

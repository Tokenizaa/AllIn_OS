// Hook React para autenticação mockada
import { useState, useEffect, useCallback } from 'react';
import MockAuthService, { MockUser, LoginResponse } from '../services/mockAuthService';

export interface UseMockAuthReturn {
  user: MockUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (email: string, password: string, fullName: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  error: string | null;
}

export function useMockAuth(): UseMockAuthReturn {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar sessão do localStorage ao montar
  useEffect(() => {
    const storedUser = MockAuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await MockAuthService.login(email, password);

      if (response.success && response.user && response.token) {
        MockAuthService.saveSession(response.user, response.token);
        setUser(response.user);
      } else {
        setError(response.error || 'Erro ao fazer login');
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    fullName: string
  ): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await MockAuthService.register(email, password, fullName);

      if (response.success && response.user && response.token) {
        MockAuthService.saveSession(response.user, response.token);
        setUser(response.user);
      } else {
        setError(response.error || 'Erro ao fazer cadastro');
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await MockAuthService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: MockAuthService.isAuthenticated(),
    login,
    register,
    logout,
    error
  };
}

export default useMockAuth;

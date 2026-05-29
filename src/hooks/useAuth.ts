import { useState, useEffect, useCallback } from 'react';

import { AuthService } from '@/integrations/supabase/services/auth';
import MockAuthService, { MockUser } from '@/services/mockAuthService';

interface Profile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthError {
  message: string;
  name: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; email?: string }) => Promise<{ error: AuthError | null }>;
}

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'master', 'store_admin']);

const normalizeError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: string }).message),
      name: 'AuthError'
    };
  }

  return { message: 'Erro desconhecido', name: 'UnknownError' };
};

const getRoleFromMetadata = (metadata?: Record<string, unknown> | null) => {
  const role = metadata?.role;
  if (!role || typeof role !== 'string') return 'user';
  return role.toLowerCase();
};

const toAuthState = (rawUser: any): { user: User; profile: Profile; isAdmin: boolean; isSuperAdmin: boolean } => {
  const metadata = rawUser?.user_metadata || {};
  const role = getRoleFromMetadata(metadata);
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = ADMIN_ROLES.has(role);

  return {
    user: {
      id: rawUser.id,
      email: rawUser.email || '',
      role
    },
    profile: {
      id: rawUser.id,
      user_id: rawUser.id,
      email: rawUser.email || '',
      full_name: typeof metadata?.full_name === 'string' ? metadata.full_name : '',
      role,
      avatar_url: typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : null,
      created_at: rawUser.created_at,
      updated_at: rawUser.updated_at
    },
    isAdmin,
    isSuperAdmin
  };
};

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const toRawUserFromMock = (mockUser: MockUser) => {
  return {
    id: mockUser.id,
    email: mockUser.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_metadata: {
      full_name: mockUser.fullName,
      role: mockUser.role,
      avatar_url: null
    }
  };
};

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const applyUserState = useCallback((rawUser: any | null) => {
    if (!rawUser) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }

    const nextState = toAuthState(rawUser);
    setUser(nextState.user);
    setProfile(nextState.profile);
    setIsAdmin(nextState.isAdmin);
    setIsSuperAdmin(nextState.isSuperAdmin);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      if (USE_MOCK_AUTH) {
        const response = await MockAuthService.login(email, password);
        if (!response.success || !response.user || !response.token) {
          throw new Error(response.error || 'Erro ao fazer login (Mock)');
        }
        MockAuthService.saveSession(response.user, response.token);
        applyUserState(toRawUserFromMock(response.user));
        return { error: null };
      }
      const { user: signedInUser, error } = await AuthService.signIn(email, password);
      if (error) throw error;
      applyUserState(signedInUser);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: normalizeError(error) };
    } finally {
      setLoading(false);
    }
  }, [applyUserState]);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      if (USE_MOCK_AUTH) {
        const response = await MockAuthService.register(email, password, fullName || '');
        if (!response.success || !response.user || !response.token) {
          throw new Error(response.error || 'Erro ao fazer cadastro (Mock)');
        }
        MockAuthService.saveSession(response.user, response.token);
        applyUserState(toRawUserFromMock(response.user));
        return { error: null };
      }
      const { user: createdUser, error } = await AuthService.signUp(email, password, fullName || '');
      if (error) throw error;
      applyUserState(createdUser);
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: normalizeError(error) };
    } finally {
      setLoading(false);
    }
  }, [applyUserState]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      if (USE_MOCK_AUTH) {
        await MockAuthService.logout();
        applyUserState(null);
        return;
      }
      await AuthService.signOut();
      applyUserState(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  }, [applyUserState]);

  const updateProfile = useCallback(async (updates: { full_name?: string; email?: string }) => {
    try {
      setLoading(true);
      if (USE_MOCK_AUTH) {
        const currentUser = MockAuthService.getCurrentUser();
        if (currentUser) {
          const updatedUser: MockUser = {
            ...currentUser,
            fullName: updates.full_name || currentUser.fullName,
            email: updates.email || currentUser.email
          };
          localStorage.setItem('mock_user', JSON.stringify(updatedUser));
          applyUserState(toRawUserFromMock(updatedUser));
        }
        return { error: null };
      }
      const { data, error } = await AuthService.updateProfile(updates);
      if (error) throw error;
      applyUserState(data);
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: normalizeError(error) };
    } finally {
      setLoading(false);
    }
  }, [applyUserState]);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        if (USE_MOCK_AUTH) {
          const mockUser = MockAuthService.getCurrentUser();
          if (active && mockUser) {
            applyUserState(toRawUserFromMock(mockUser));
          } else if (active) {
            applyUserState(null);
          }
          return;
        }
        const { user: currentUser } = await AuthService.getCurrentUser();
        if (active) applyUserState(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    initialize();

    if (USE_MOCK_AUTH) {
      setLoading(false);
      return;
    }

    const subscription = AuthService.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      let user = session?.user || null;

      if (user) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: allinUser } = await supabase
            .from('allin.users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (allinUser && allinUser.role) {
            user.user_metadata = {
              ...user.user_metadata,
              role: allinUser.role
            };
          }
        } catch (error) {
          console.error('Erro ao buscar role da tabela allin.users:', error);
        }
      }

      applyUserState(user);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applyUserState]);

  return { user, profile, loading, isAdmin, isSuperAdmin, signIn, signUp, signOut, updateProfile };
};

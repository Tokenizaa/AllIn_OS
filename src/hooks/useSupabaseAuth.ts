import { useState, useEffect, useCallback } from 'react'

import { User } from '@supabase/supabase-js'

import { AuthService } from '@/integrations/supabase/services/auth'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User | null; error: Error | null }>
  getCurrentUser: () => Promise<{ user: User | null; error: Error | null }>
  updateProfile: (updates: { full_name?: string; email?: string }) => Promise<{ data: User | null; error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

export const useSupabaseAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { user: currentUser, error: authError } = await AuthService.getCurrentUser()
      
      if (authError) throw authError
      setUser(currentUser)
      return { user: currentUser, error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao obter usuário atual:', err)
      return { user: null, error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { user: signedInUser, error: authError } = await AuthService.signIn(email, password)
      
      if (authError) throw authError
      setUser(signedInUser)
      return { user: signedInUser, error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao realizar login:', err)
      return { user: null, error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { error: authError } = await AuthService.signOut()
      
      if (authError) throw authError
      setUser(null)
      return { error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao realizar logout:', err)
      return { error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)
      const { user: newUser, error: authError } = await AuthService.signUp(email, password, fullName)
      
      if (authError) throw authError
      setUser(newUser)
      return { user: newUser, error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao registrar usuário:', err)
      return { user: null, error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updates: { full_name?: string; email?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const { data: updatedUser, error: authError } = await AuthService.updateProfile(updates)
      
      if (authError) throw authError
      if (updatedUser) setUser(updatedUser)
      return { data: updatedUser, error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao atualizar perfil:', err)
      return { data: null, error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error: authError } = await AuthService.resetPassword(email)
      
      if (authError) throw authError
      return { error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao enviar email de redefinição de senha:', err)
      return { error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error: authError } = await AuthService.updatePassword(password)
      
      if (authError) throw authError
      return { error: null }
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao atualizar senha:', err)
      return { error: err as Error }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Verificar usuário atual ao carregar o hook
    getCurrentUser()

    // Escutar mudanças no estado de autenticação
    const subscription = AuthService.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Limpar listener ao desmontar o componente
    return () => {
      subscription.unsubscribe()
    }
  }, [getCurrentUser])

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    getCurrentUser,
    updateProfile,
    resetPassword,
    updatePassword
  }
}
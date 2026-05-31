import { User } from '@supabase/supabase-js'

import { supabase } from '../client'

/**
 * Serviço para gerenciar autenticação com Supabase
 */
export class AuthService {
  /**
   * Realiza login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Objeto com usuário e erro (se houver)
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const user = data.user

      if (user) {
        // Buscar dados da tabela allin.users para obter o role correto
        const { data: allinUser, error: allinError } = await supabase
          .from('allin.users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!allinError && allinUser && allinUser.role) {
          // Mesclar o role da tabela allin.users no user_metadata
          user.user_metadata = {
            ...user.user_metadata,
            role: allinUser.role
          }
        }
      }

      return { user, error: null }
    } catch (error) {
      console.error('Erro ao realizar login:', error)
      return { user: null, error }
    }
  }

  /**
   * Realiza logout do usuário
   * @returns Objeto com erro (se houver)
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
      return { error }
    }
  }

  /**
   * Registra um novo usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @param fullName Nome completo do usuário
   * @returns Objeto com usuário e erro (se houver)
   */
  static async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            login: email.split('@')[0], // Extrair login do email
            role: 'user'
          }
        }
      })

      if (error) throw error

      const user = data.user
      if (user) {
        // Criar usuário na tabela allin.users
        const { error: dbError } = await supabase
          .from('allin.users')
          .insert({
            id: user.id,
            email: user.email,
            name: fullName || user.email?.split('@')[0] || '',
            login: email.split('@')[0],
            role: 'user',
            status: 'active'
          })

        if (dbError) {
          console.error('Erro ao criar usuário em allin.users:', dbError)
          // Não falhar o cadastro se allin.users falhar
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error)
      return { user: null, error }
    }
  }

  /**
   * Obtém o usuário atual com dados da tabela allin.users
   * @returns Objeto com usuário e erro (se houver)
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        // Se não houver sessão, retorna null sem tratar como erro
        if (error.message?.includes('Auth session missing') || error.message?.includes('No session')) {
          return { user: null, error: null }
        }
        throw error
      }

      if (!user) {
        return { user: null, error: null }
      }

      // Buscar dados da tabela allin.users para obter o role correto
      const { data: allinUser, error: allinError } = await supabase
        .from('allin.users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!allinError && allinUser && allinUser.role) {
        // Mesclar o role da tabela allin.users no user_metadata
        user.user_metadata = {
          ...user.user_metadata,
          role: allinUser.role
        }
      }

      return { user, error: null }
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return { user: null, error }
    }
  }

  /**
   * Atualiza os dados do perfil do usuário
   * @param updates Dados a serem atualizados
   * @returns Objeto com dados atualizados e erro (se houver)
   */
  static async updateProfile(updates: { full_name?: string; email?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error
      return { data: data.user, error: null }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { data: null, error }
    }
  }

  /**
   * Envia email de redefinição de senha
   * @param email Email do usuário
   * @returns Objeto com erro (se houver)
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erro ao enviar email de redefinição de senha:', error)
      return { error }
    }
  }

  /**
   * Atualiza a senha do usuário
   * @param password Nova senha
   * @returns Objeto com erro (se houver)
   */
  static async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      return { error }
    }
  }

  /**
   * Escuta mudanças no estado de autenticação
   * @param callback Função a ser chamada quando o estado de autenticação mudar
   * @returns Função para remover o listener
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return subscription
  }
}
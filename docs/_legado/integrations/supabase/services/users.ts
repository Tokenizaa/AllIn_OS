import { User } from '@/types/users'

import { supabase } from '../client'

// Tipos para usuários no Supabase
export interface SupabaseUser {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

/**
 * Serviço para gerenciar usuários no Supabase
 */
export class UsersService {
  /**
   * Obtém todos os usuários
   * @returns Lista de usuários
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(user => ({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      }))
    } catch (error) {
      console.error('Erro ao obter usuários:', error)
      throw error
    }
  }

  /**
   * Obtém um usuário pelo ID
   * @param userId ID do usuário
   * @returns Usuário encontrado ou null
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: data.role,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error)
      throw error
    }
  }

  /**
   * Cria um novo usuário
   * @param userData Dados do usuário
   * @returns Usuário criado
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: userData.fullName,
          email: userData.email,
          role: userData.role
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: data.role,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    }
  }

  /**
   * Atualiza um usuário existente
   * @param userId ID do usuário
   * @param userData Dados atualizados
   * @returns Usuário atualizado
   */
  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: userData.fullName,
          email: userData.email,
          role: userData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: data.role,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  /**
   * Remove um usuário
   * @param userId ID do usuário
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao remover usuário:', error)
      throw error
    }
  }

  /**
   * Busca usuários por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de usuários que correspondem ao termo
   */
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(user => ({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  /**
   * Altera a função de um usuário
   * @param userId ID do usuário
   * @param newRole Nova função
   */
  static async changeUserRole(userId: string, newRole: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao alterar função do usuário:', error)
      throw error
    }
  }
}
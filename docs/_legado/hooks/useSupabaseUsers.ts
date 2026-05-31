import { useState, useEffect, useCallback } from 'react'

import { UsersService } from '@/integrations/supabase/services/users'
import { User } from '@/types/users'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: Error | null
  fetchUsers: () => Promise<void>
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User | null>
  updateUser: (userId: string, userData: Partial<User>) => Promise<User | null>
  deleteUser: (userId: string) => Promise<boolean>
  searchUsers: (searchTerm: string) => Promise<User[]>
  changeUserRole: (userId: string, newRole: string) => Promise<void>
}

export const useSupabaseUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const usersData = await UsersService.getAllUsers()
      setUsers(usersData)
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const newUser = await UsersService.createUser(userData)
      setUsers(prev => [newUser, ...prev])
      return newUser
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao criar usuário:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (userId: string, userData: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)
      const updatedUser = await UsersService.updateUser(userId, userData)
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao atualizar usuário:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      await UsersService.deleteUser(userId)
      setUsers(prev => prev.filter(user => user.id !== userId))
      return true
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao remover usuário:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const searchUsers = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true)
      setError(null)
      const searchResults = await UsersService.searchUsers(searchTerm)
      return searchResults
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao buscar usuários:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const changeUserRole = useCallback(async (userId: string, newRole: string) => {
    try {
      setLoading(true)
      setError(null)
      await UsersService.changeUserRole(userId, newRole)
      const validRole = (newRole === 'admin' || newRole === 'user' || newRole === 'distributor') ? newRole : 'user';
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: validRole } : user
      ))
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao alterar função do usuário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    changeUserRole
  }
}
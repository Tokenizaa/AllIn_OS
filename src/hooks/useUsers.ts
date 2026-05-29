import { useState, useEffect, useCallback } from 'react';

import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Carregar usuários do localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Atualizar usuário no localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map((user: UserProfile) => {
        if (user.id === userId) {
          return {
            ...user,
            role: newRole,
            updated_at: new Date().toISOString()
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      toast({
        title: "Role atualizada",
        description: `Usuário agora é ${newRole}`
      });
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a role do usuário",
        variant: "destructive"
      });
    }
  };

  return { users, loading, updateUserRole, fetchUsers };
};
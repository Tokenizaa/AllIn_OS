/**
 * Serviço para gerenciar usuários
 */
export class UserService {
  /**
   * Salva um usuário no localStorage
   * @param userData Dados do usuário
   */
  static saveUser(userData: any): void {
    try {
      const users = this.getUsers();
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  /**
   * Obtém todos os usuários do localStorage
   * @returns Lista de usuários
   */
  static getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param userId ID do usuário
   * @returns Usuário encontrado ou null
   */
  static getUserById(userId: string): any | null {
    try {
      const users = this.getUsers();
      return users.find((user: any) => user.id === userId) || null;
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      return null;
    }
  }

  /**
   * Atualiza os dados de um usuário
   * @param userId ID do usuário
   * @param updatedData Dados atualizados
   */
  static updateUser(userId: string, updatedData: any): void {
    try {
      const users = this.getUsers();
      const index = users.findIndex((user: any) => user.id === userId);
      
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  }

  /**
   * Remove um usuário pelo ID
   * @param userId ID do usuário
   */
  static deleteUser(userId: string): void {
    try {
      const users = this.getUsers();
      const filteredUsers = users.filter((user: any) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  }

  /**
   * Busca usuários por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de usuários que correspondem ao termo
   */
  static searchUsers(searchTerm: string): any[] {
    try {
      const users = this.getUsers();
      const searchLower = searchTerm.toLowerCase();
      
      return users.filter((user: any) => 
        (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  /**
   * Altera a função de um usuário
   * @param userId ID do usuário
   * @param newRole Nova função
   */
  static changeUserRole(userId: string, newRole: string): void {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex((user: any) => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Erro ao alterar função do usuário:', error);
    }
  }
}
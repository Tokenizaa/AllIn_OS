/**
 * Serviço para gerenciar solicitações administrativas
 */
export class AdminRequestService {
  /**
   * Salva uma solicitação no localStorage
   * @param requestData Dados da solicitação
   */
  static saveRequest(requestData: any): void {
    try {
      const requests = this.getRequests();
      requests.push(requestData);
      localStorage.setItem('adminRequests', JSON.stringify(requests));
    } catch (error) {
      console.error('Erro ao salvar solicitação:', error);
    }
  }

  /**
   * Obtém todas as solicitações do localStorage
   * @returns Lista de solicitações
   */
  static getRequests(): any[] {
    try {
      return JSON.parse(localStorage.getItem('adminRequests') || '[]');
    } catch (error) {
      console.error('Erro ao obter solicitações:', error);
      return [];
    }
  }

  /**
   * Busca uma solicitação pelo ID
   * @param requestId ID da solicitação
   * @returns Solicitação encontrada ou null
   */
  static getRequestById(requestId: string): any | null {
    try {
      const requests = this.getRequests();
      return requests.find((request: any) => request.id === requestId) || null;
    } catch (error) {
      console.error('Erro ao obter solicitação por ID:', error);
      return null;
    }
  }

  /**
   * Atualiza os dados de uma solicitação
   * @param requestId ID da solicitação
   * @param updatedData Dados atualizados
   */
  static updateRequest(requestId: string, updatedData: any): void {
    try {
      const requests = this.getRequests();
      const index = requests.findIndex((request: any) => request.id === requestId);
      
      if (index !== -1) {
        requests[index] = { ...requests[index], ...updatedData };
        localStorage.setItem('adminRequests', JSON.stringify(requests));
      }
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
    }
  }

  /**
   * Remove uma solicitação pelo ID
   * @param requestId ID da solicitação
   */
  static deleteRequest(requestId: string): void {
    try {
      const requests = this.getRequests();
      const filteredRequests = requests.filter((request: any) => request.id !== requestId);
      localStorage.setItem('adminRequests', JSON.stringify(filteredRequests));
    } catch (error) {
      console.error('Erro ao remover solicitação:', error);
    }
  }

  /**
   * Busca solicitações por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de solicitações que correspondem ao termo
   */
  static searchRequests(searchTerm: string): any[] {
    try {
      const requests = this.getRequests();
      const searchLower = searchTerm.toLowerCase();
      
      return requests.filter((request: any) => 
        (request.userName && request.userName.toLowerCase().includes(searchLower)) ||
        (request.userEmail && request.userEmail.toLowerCase().includes(searchLower)) ||
        (request.description && request.description.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      return [];
    }
  }

  /**
   * Altera o status de uma solicitação
   * @param requestId ID da solicitação
   * @param newStatus Novo status
   */
  static changeRequestStatus(requestId: string, newStatus: string): void {
    try {
      const requests = this.getRequests();
      const requestIndex = requests.findIndex((request: any) => request.id === requestId);
      
      if (requestIndex !== -1) {
        requests[requestIndex].status = newStatus;
        localStorage.setItem('adminRequests', JSON.stringify(requests));
      }
    } catch (error) {
      console.error('Erro ao alterar status da solicitação:', error);
    }
  }
}
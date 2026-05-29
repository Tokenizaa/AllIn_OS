import { LeadData } from '@/hooks/useLeadManagement';

/**
 * Serviço para gerenciar leads
 */
export class LeadService {
  /**
   * Salva um lead no localStorage
   * @param leadData Dados do lead
   */
  static saveLead(leadData: LeadData): void {
    try {
      const leads = this.getLeads();
      leads.push(leadData);
      localStorage.setItem('leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    }
  }

  /**
   * Obtém todos os leads do localStorage
   * @returns Lista de leads
   */
  static getLeads(): LeadData[] {
    try {
      return JSON.parse(localStorage.getItem('leads') || '[]');
    } catch (error) {
      console.error('Erro ao obter leads:', error);
      return [];
    }
  }

  /**
   * Busca um lead pelo ID
   * @param leadId ID do lead
   * @returns Lead encontrado ou null
   */
  static getLeadById(leadId: string): LeadData | null {
    try {
      const leads = this.getLeads();
      return leads.find(lead => lead.leadId === leadId) || null;
    } catch (error) {
      console.error('Erro ao obter lead por ID:', error);
      return null;
    }
  }

  /**
   * Atualiza os dados de um lead
   * @param leadId ID do lead
   * @param updatedData Dados atualizados
   */
  static updateLead(leadId: string, updatedData: Partial<LeadData>): void {
    try {
      const leads = this.getLeads();
      const index = leads.findIndex(lead => lead.leadId === leadId);
      
      if (index !== -1) {
        leads[index] = { ...leads[index], ...updatedData };
        localStorage.setItem('leads', JSON.stringify(leads));
      }
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  }

  /**
   * Remove um lead pelo ID
   * @param leadId ID do lead
   */
  static deleteLead(leadId: string): void {
    try {
      const leads = this.getLeads();
      const filteredLeads = leads.filter(lead => lead.leadId !== leadId);
      localStorage.setItem('leads', JSON.stringify(filteredLeads));
    } catch (error) {
      console.error('Erro ao remover lead:', error);
    }
  }

  /**
   * Busca leads por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de leads que correspondem ao termo
   */
  static searchLeads(searchTerm: string): LeadData[] {
    try {
      const leads = this.getLeads();
      const searchLower = searchTerm.toLowerCase();
      
      return leads.filter(lead => 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.whatsapp.includes(searchTerm)
      );
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return [];
    }
  }

  /**
   * Calcula o score médio dos leads
   * @returns Score médio
   */
  static getAverageLeadScore(): number {
    try {
      // Esta função pode ser expandida para calcular o score real dos leads
      // Por enquanto, retorna um valor fixo para demonstração
      return 75;
    } catch (error) {
      console.error('Erro ao calcular score médio:', error);
      return 0;
    }
  }
}
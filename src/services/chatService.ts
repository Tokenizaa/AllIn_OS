import { ChatConversation } from '@/hooks/useChatConversations';

/**
 * Serviço para gerenciar conversas do chat
 */
export class ChatService {
  /**
   * Salva uma conversa no localStorage
   * @param conversation Dados da conversa
   */
  static saveConversation(conversation: ChatConversation): void {
    try {
      const conversations = this.getConversations();
      conversations.push(conversation);
      localStorage.setItem('chatConversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  }

  /**
   * Obtém todas as conversas do localStorage
   * @returns Lista de conversas
   */
  static getConversations(): ChatConversation[] {
    try {
      return JSON.parse(localStorage.getItem('chatConversations') || '[]');
    } catch (error) {
      console.error('Erro ao obter conversas:', error);
      return [];
    }
  }

  /**
   * Agrupa conversas por session_id
   * @returns Objeto com conversas agrupadas por session_id
   */
  static groupConversationsBySession(): Record<string, ChatConversation[]> {
    try {
      const conversations = this.getConversations();
      return conversations.reduce((acc, conv) => {
        if (!acc[conv.session_id]) {
          acc[conv.session_id] = [];
        }
        acc[conv.session_id].push(conv);
        return acc;
      }, {} as Record<string, ChatConversation[]>);
    } catch (error) {
      console.error('Erro ao agrupar conversas:', error);
      return {};
    }
  }

  /**
   * Busca conversas por termo de pesquisa
   * @param searchTerm Termo de pesquisa
   * @returns Lista de conversas que correspondem ao termo
   */
  static searchConversations(searchTerm: string): ChatConversation[] {
    try {
      const conversations = this.getConversations();
      const searchLower = searchTerm.toLowerCase();
      
      return conversations.filter(conv => 
        (conv.user_name && conv.user_name.toLowerCase().includes(searchLower)) ||
        conv.user_message.toLowerCase().includes(searchLower) ||
        conv.ai_response.toLowerCase().includes(searchLower) ||
        (conv.user_whatsapp && conv.user_whatsapp.includes(searchTerm))
      );
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }

  /**
   * Filtra conversas por estágio
   * @param stage Estágio da conversa
   * @returns Lista de conversas filtradas
   */
  static filterConversationsByStage(stage: string): ChatConversation[] {
    try {
      const conversations = this.getConversations();
      return conversations.filter(conv => conv.conversation_stage === stage);
    } catch (error) {
      console.error('Erro ao filtrar conversas por estágio:', error);
      return [];
    }
  }

  /**
   * Calcula o score médio das conversas
   * @returns Score médio
   */
  static getAverageConversationScore(): number {
    try {
      const conversations = this.getConversations();
      if (conversations.length === 0) return 0;
      
      const totalScore = conversations.reduce((sum, conv) => sum + (conv.lead_score || 0), 0);
      return Math.round(totalScore / conversations.length);
    } catch (error) {
      console.error('Erro ao calcular score médio:', error);
      return 0;
    }
  }

  /**
   * Conta o número de conversas de hoje
   * @returns Número de conversas de hoje
   */
  static getTodayConversationsCount(): number {
    try {
      const conversations = this.getConversations();
      const today = new Date().toDateString();
      
      return conversations.filter(conv => 
        new Date(conv.timestamp).toDateString() === today
      ).length;
    } catch (error) {
      console.error('Erro ao contar conversas de hoje:', error);
      return 0;
    }
  }

  /**
   * Exporta conversas para CSV
   * @param conversations Lista de conversas
   * @returns Dados CSV como string
   */
  static exportConversationsToCSV(conversations: ChatConversation[]): string {
    try {
      const csvContent = [
        ['Data', 'Nome', 'WhatsApp', 'Estágio', 'Score', 'Mensagem do Usuário', 'Resposta do AI'].join(','),
        ...conversations.map(conv => [
          new Date(conv.timestamp).toLocaleString('pt-BR'),
          conv.user_name || '',
          conv.user_whatsapp || '',
          conv.conversation_stage || '',
          conv.lead_score || 0,
          `"${conv.user_message.replace(/"/g, '""')}"`,
          `"${conv.ai_response.replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Erro ao exportar conversas para CSV:', error);
      return '';
    }
  }
}
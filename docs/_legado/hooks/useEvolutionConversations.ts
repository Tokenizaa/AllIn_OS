import { useState, useEffect } from 'react';
import { EvolutionApiService, EvolutionConversation } from '@/services/evolutionApiService';

export interface EvolutionConversationFormatted {
  id: string;
  session_id: string;
  user_message: string;
  ai_response: string;
  lead_id: string | null;
  user_name: string | null;
  user_whatsapp: string | null;
  conversation_stage: string | null;
  lead_score: number | null;
  timestamp: string;
}

export const useEvolutionConversations = () => {
  const [conversations, setConversations] = useState<EvolutionConversationFormatted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const evolutionConversations = await EvolutionApiService.getAllConversations();
      const formattedConversations = EvolutionApiService.convertToChatConversations(evolutionConversations);
      
      setConversations(formattedConversations);
    } catch (error: any) {
      console.error('Erro ao buscar conversas da Evolution API:', error);
      setError(error.message || 'Falha ao carregar conversas');
      
      // Fallback para localStorage se a API falhar
      try {
        const storedConversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
        setConversations(storedConversations);
      } catch (localStorageError) {
        console.error('Erro ao carregar do localStorage:', localStorageError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Agrupar conversas por session_id
  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.session_id]) {
      acc[conv.session_id] = [];
    }
    acc[conv.session_id].push(conv);
    return acc;
  }, {} as Record<string, EvolutionConversationFormatted[]>);

  // Calcular score médio dos leads
  const getAverageLeadScore = () => {
    if (conversations.length === 0) return 0;
    
    const totalScore = conversations.reduce((sum, conv) => sum + (conv.lead_score || 0), 0);
    return Math.round(totalScore / conversations.length);
  };

  // Contar conversas de hoje
  const getTodayConversationsCount = () => {
    return conversations.filter(conv => 
      new Date(conv.timestamp).toDateString() === new Date().toDateString()
    ).length;
  };

  // Contar sessões únicas
  const getUniqueSessionsCount = () => {
    return Object.keys(groupedConversations).length;
  };

  // Salvar conversa no localStorage (backup)
  const saveConversation = (conversation: EvolutionConversationFormatted) => {
    try {
      const newConversations = [...conversations, conversation];
      setConversations(newConversations);
      localStorage.setItem('chatConversations', JSON.stringify(newConversations));
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  };

  // Buscar conversas por termo
  const searchConversations = (searchTerm: string) => {
    const searchLower = searchTerm.toLowerCase();
    
    return conversations.filter(conv => 
      (conv.user_name && conv.user_name.toLowerCase().includes(searchLower)) ||
      conv.user_message.toLowerCase().includes(searchLower) ||
      conv.ai_response.toLowerCase().includes(searchLower) ||
      (conv.user_whatsapp && conv.user_whatsapp.includes(searchTerm))
    );
  };

  // Filtrar conversas por estágio
  const filterConversationsByStage = (stage: string) => {
    return conversations.filter(conv => conv.conversation_stage === stage);
  };

  return {
    conversations,
    groupedConversations,
    loading,
    error,
    fetchConversations,
    saveConversation,
    getAverageLeadScore,
    getTodayConversationsCount,
    getUniqueSessionsCount,
    searchConversations,
    filterConversationsByStage
  };
};

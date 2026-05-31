import { useState, useEffect } from 'react';

export interface ChatConversation {
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

export const useChatConversations = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // Carregar conversas do localStorage
  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
    setConversations(storedConversations);
  }, []);

  // Salvar conversa no localStorage
  const saveConversation = (conversation: ChatConversation) => {
    const newConversations = [...conversations, conversation];
    setConversations(newConversations);
    localStorage.setItem('chatConversations', JSON.stringify(newConversations));
  };

  // Agrupar conversas por session_id
  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.session_id]) {
      acc[conv.session_id] = [];
    }
    acc[conv.session_id].push(conv);
    return acc;
  }, {} as Record<string, ChatConversation[]>);

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

  return {
    conversations,
    groupedConversations,
    saveConversation,
    getAverageLeadScore,
    getTodayConversationsCount
  };
};
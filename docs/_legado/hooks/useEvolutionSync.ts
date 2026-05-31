import { useState, useEffect } from 'react';
import { EvolutionSyncService } from '@/services/evolutionSyncService';

export interface SyncedConversation {
  id: string;
  session_id: string;
  channel: string;
  status: string;
  contact_name: string | null;
  contact_phone: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  chatbot_messages: Array<{
    id: string;
    role: string;
    message: string;
    created_at: string;
  }>;
}

export const useEvolutionSync = () => {
  const [conversations, setConversations] = useState<SyncedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const syncedConversations = await EvolutionSyncService.getSyncedConversations();
      setConversations(syncedConversations);
    } catch (error: any) {
      console.error('Erro ao buscar conversas sincronizadas:', error);
      setError(error.message || 'Falha ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const syncWithEvolution = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      await EvolutionSyncService.syncAllConversations();
      
      // Atualizar conversas após sincronização
      await fetchConversations();
      
      return true;
    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      setError(error.message || 'Falha na sincronização');
      return false;
    } finally {
      setSyncing(false);
    }
  };

  const getSessionMessages = async (sessionId: string) => {
    try {
      return await EvolutionSyncService.getSessionMessages(sessionId);
    } catch (error: any) {
      console.error('Erro ao buscar mensagens da sessão:', error);
      return [];
    }
  };

  const sendMessage = async (number: string, text: string) => {
    try {
      return await EvolutionSyncService.sendMessageAndSync(number, text);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Agrupar conversas por sessão
  const groupedConversations = conversations.reduce((acc, conv) => {
    acc[conv.session_id] = conv;
    return acc;
  }, {} as Record<string, SyncedConversation>);

  // Calcular estatísticas
  const getTotalConversations = () => conversations.length;
  
  const getTodayConversationsCount = () => {
    const today = new Date().toDateString();
    return conversations.filter(conv => 
      new Date(conv.last_activity_at).toDateString() === today
    ).length;
  };
  
  const getUniqueSessionsCount = () => Object.keys(groupedConversations).length;
  
  const getTotalMessages = () => {
    return conversations.reduce((total, conv) => 
      total + (conv.chatbot_messages?.length || 0), 0
    );
  };

  return {
    conversations,
    groupedConversations,
    loading,
    syncing,
    error,
    fetchConversations,
    syncWithEvolution,
    getSessionMessages,
    sendMessage,
    getTotalConversations,
    getTodayConversationsCount,
    getUniqueSessionsCount,
    getTotalMessages
  };
};

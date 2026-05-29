import { useEffect, useMemo, useState } from 'react';

import { EvolutionApiService } from '@/services/evolutionApiService';

export interface DirectEvolutionChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
}

export interface DirectEvolutionSession {
  sessionId: string;
  contactName: string;
  contactPhone: string;
  unreadCount: number;
  timestamp: string;
  lastMessage: string;
  messages: DirectEvolutionChatMessage[];
}

export const useEvolutionDirect = () => {
  const [sessions, setSessions] = useState<DirectEvolutionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const evolutionConversations = await EvolutionApiService.getAllConversations();
      const formattedSessions: DirectEvolutionSession[] = evolutionConversations.map((conv) => ({
        sessionId: conv.sessionId,
        contactName: conv.contactName || 'Usuário Anônimo',
        contactPhone: conv.contactPhone || '',
        unreadCount: conv.unreadCount || 0,
        timestamp: new Date(conv.timestamp).toISOString(),
        lastMessage: conv.lastMessage,
        messages: (conv.messages || [])
          .map((msg) => ({
            id: msg.id || msg.key?.id || `${conv.sessionId}-${msg.messageTimestamp}`,
            text: EvolutionApiService.extractMessageText(msg),
            fromMe: !!msg.key?.fromMe,
            timestamp: new Date((msg.messageTimestamp || 0) * 1000).toISOString()
          }))
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      }));

      setSessions(formattedSessions);
    } catch (err: any) {
      console.error('❌ Erro ao buscar conversas:', err);
      setError(err.message || 'Falha ao carregar conversas da Evolution API');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (session: DirectEvolutionSession, text: string) => {
    if (!text.trim()) return;

    await EvolutionApiService.sendTextMessage(session.contactPhone, text.trim());

    await fetchConversations();
  };

  const getTodayConversationsCount = () => {
    const today = new Date().toDateString();
    return sessions.filter((session) => new Date(session.timestamp).toDateString() === today).length;
  };

  const filteredSessions = useMemo(() => sessions, [sessions]);

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    sessions: filteredSessions,
    loading,
    error,
    fetchConversations,
    sendMessage,
    getTodayConversationsCount
  };
};

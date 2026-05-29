import { useState, useEffect, useCallback } from 'react';

import { searchKnowledge } from '@/utils/knowledgeBaseLoader';
import { AgentActionButton, AgentProduct, AgentNextStep } from '@/types/agent';
import { sendMessageToMaster } from '@/services/agent/agentClient';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sessionId?: string;
}

interface StoredChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  sessionId?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  hasShownLeadModal: boolean;
  leadData: { name: string; whatsapp: string; leadId: string } | null;
}

const STORAGE_KEY = 'allin-chat-state';
const LEAD_MODAL_KEY = 'allin-lead-modal-shown';

export const useChatLogic = () => {
  const [state, setState] = useState<ChatState>(() => {
    // Recuperar estado do localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    const hasShownModal = localStorage.getItem(LEAD_MODAL_KEY) === 'true';
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          messages: parsed.messages.map((msg: StoredChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          hasShownLeadModal: hasShownModal,
          isLoading: false,
          error: null
        };
      } catch {
        // Se der erro, usar estado padrão
      }
    }
    
    return {
      messages: [],
      isLoading: false,
      error: null,
      sessionId: crypto.randomUUID(),
      hasShownLeadModal: hasShownModal,
      leadData: null
    };
  });

  const [agentActionButtons, setAgentActionButtons] = useState<AgentActionButton[]>([]);
  const [agentProducts, setAgentProducts] = useState<AgentProduct[]>([]);
  const [agentNextStep, setAgentNextStep] = useState<AgentNextStep>('none');

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    const stateToSave = {
      messages: state.messages,
      sessionId: state.sessionId,
      leadData: state.leadData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state.messages, state.sessionId, state.leadData]);

  // Função para salvar conversa no localStorage
  const saveConversationToLocalStorage = useCallback(async (userMessage: string, aiResponse: string) => {
    try {
      const conversationData = {
        id: crypto.randomUUID(),
        session_id: state.sessionId,
        user_message: userMessage,
        ai_response: aiResponse,
        lead_id: state.leadData?.leadId || null,
        user_name: state.leadData?.name || null,
        user_whatsapp: state.leadData?.whatsapp || null,
        conversation_stage: state.messages.length === 0 ? 'inicial' : 'em_andamento',
        lead_score: calculateLeadScore(userMessage),
        timestamp: new Date().toISOString()
      };

      // Salvar conversa no localStorage
      const conversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
      conversations.push(conversationData);
      localStorage.setItem('chatConversations', JSON.stringify(conversations));

      console.log('Conversa salva:', conversationData);
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  }, [state.sessionId, state.leadData, state.messages.length]);

  // Função para calcular score do lead baseado na mensagem
  const calculateLeadScore = (message: string): number => {
    const positiveWords = ['interessado', 'quero', 'gostaria', 'preciso', 'como', 'renda', 'negócio', 'oportunidade'];
    const lowerMessage = message.toLowerCase();
    
    let score = 0;
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) score += 10;
    });
    
    return Math.min(score, 100);
  };

  // Função para adicionar mensagem
  const addMessage = useCallback((text: string, isUser: boolean): string => {
    const messageId = crypto.randomUUID();
    const newMessage: ChatMessage = {
      id: messageId,
      text,
      isUser,
      timestamp: new Date(),
      sessionId: state.sessionId
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return messageId;
  }, [state.sessionId]);

  // Função para verificar se deve mostrar modal de lead
  const shouldShowLeadModal = useCallback((): boolean => {
    return !state.hasShownLeadModal && state.messages.length === 0;
  }, [state.hasShownLeadModal, state.messages.length]);

  // Função para marcar que o modal foi mostrado
  const markLeadModalShown = useCallback(() => {
    localStorage.setItem(LEAD_MODAL_KEY, 'true');
    setState(prev => ({ ...prev, hasShownLeadModal: true }));
  }, []);

  // Função para definir dados do lead
  const setLeadData = useCallback((leadData: { name: string; whatsapp: string; leadId: string }) => {
    setState(prev => ({ ...prev, leadData }));
  }, []);

  // Função para enviar mensagem
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Adicionar mensagem do usuário
      addMessage(message.trim(), true);

      // Simular delay para resposta mais natural
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Buscar resposta na base de conhecimento
      const agentResponse = await sendMessageToMaster({
        message: message.trim(),
        sessionId: state.sessionId,
        channel: 'webchat',
        lead: state.leadData
          ? {
              name: state.leadData.name,
              phone: state.leadData.whatsapp,
              email: undefined
            }
          : undefined
      });

      addMessage(agentResponse.message, false);
      setAgentActionButtons(agentResponse.actionButtons);
      setAgentProducts(agentResponse.products);
      setAgentNextStep(agentResponse.nextStep);

      await saveConversationToLocalStorage(message.trim(), agentResponse.message);

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setState(prev => ({
        ...prev,
        error: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, state.leadData, addMessage, saveConversationToLocalStorage]);

  // Função para resetar chat
  const resetChat = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    setState({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: newSessionId,
      hasShownLeadModal: false,
      leadData: null
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEAD_MODAL_KEY);
    setAgentActionButtons([]);
    setAgentProducts([]);
    setAgentNextStep('none');
  }, []);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Adicionar mensagem de boas-vindas se não houver mensagens
  useEffect(() => {
    if (state.messages.length === 0 && !state.isLoading) {
      const welcomeMessage = "👋 **Olá! Seja bem-vindo(a) à Allin!**\n\nSou o **Agente Allin**, seu especialista em oportunidades de negócio no mercado de bem-estar!\n\n🎯 **Estou aqui para te ajudar com:**\n• Conhecer nossos planos de distribuição\n• Entender como ganhar dinheiro conosco\n• Descobrir nossa tecnologia única\n• Começar seu negócio hoje mesmo!\n\n**Como posso te ajudar a transformar sua vida financeira?** ✨";
      
      setTimeout(() => {
        addMessage(welcomeMessage, false);
      }, 500);
    }
  }, [state.messages.length, state.isLoading, addMessage]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sessionId: state.sessionId,
    leadData: state.leadData,
    agentActionButtons,
    agentProducts,
    agentNextStep,
    sendMessage,
    resetChat,
    clearError,
    shouldShowLeadModal,
    markLeadModalShown,
    setLeadData
  };
};

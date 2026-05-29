import { useState, useEffect } from 'react';

export interface LeadData {
  name: string;
  whatsapp: string;
  leadId: string;
}

export const useLeadManagement = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [currentLead, setCurrentLead] = useState<LeadData | null>(null);

  // Carregar leads do localStorage
  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
    
    // Verificar se há um lead ativo
    const storedChatState = localStorage.getItem('allin-chat-state');
    if (storedChatState) {
      try {
        const parsed = JSON.parse(storedChatState);
        if (parsed.leadData) {
          setCurrentLead(parsed.leadData);
        }
      } catch (error) {
        console.error('Erro ao carregar estado do chat:', error);
      }
    }
  }, []);

  // Salvar lead no localStorage
  const saveLead = (leadData: LeadData) => {
    const newLeads = [...leads, leadData];
    setLeads(newLeads);
    localStorage.setItem('leads', JSON.stringify(newLeads));
    setCurrentLead(leadData);
  };

  // Atualizar lead atual no estado do chat
  const updateChatStateWithLead = (leadData: LeadData) => {
    const chatState = localStorage.getItem('allin-chat-state');
    if (chatState) {
      try {
        const parsed = JSON.parse(chatState);
        parsed.leadData = leadData;
        localStorage.setItem('allin-chat-state', JSON.stringify(parsed));
        setCurrentLead(leadData);
      } catch (error) {
        console.error('Erro ao atualizar estado do chat:', error);
      }
    }
  };

  return {
    leads,
    currentLead,
    saveLead,
    updateChatStateWithLead
  };
};
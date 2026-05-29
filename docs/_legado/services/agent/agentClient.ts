import { AgentResponsePayload, AgentActionButton, AgentNextStep } from '@/types/agent';
import { searchKnowledge } from '@/utils/knowledgeBaseLoader';
import { MASTER_DEFAULT_ACTION_BUTTONS } from '@/sdk/agentMaster';
import { supabase } from '@/integrations/supabase/client';

interface EvolutionAgentPayload {
  message: string;
  channel: 'webchat' | 'whatsapp' | 'instagram';
  sessionId: string;
  lead?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

const MOCK_BUTTONS: AgentActionButton[] = MASTER_DEFAULT_ACTION_BUTTONS.map((button) => ({ ...button }));

const detectIntent = (message: string): AgentNextStep => {
  const text = message.toLowerCase();
  if (text.includes('suporte') || text.includes('problema')) return 'support_distributor';
  if (text.includes('plano') || text.includes('oportunidade') || text.includes('distribuidor')) return 'recruitment';
  if (text.includes('produto') || text.includes('tecnologia')) return 'client_final';
  return 'none';
};

const mockResponse = (payload: EvolutionAgentPayload): AgentResponsePayload => {
  return {
    message: searchKnowledge(payload.message),
    actionButtons: MOCK_BUTTONS,
    nextStep: detectIntent(payload.message),
    products: []
  };
};

export const sendMessageToMaster = async (payload: EvolutionAgentPayload): Promise<AgentResponsePayload> => {
  // Try edge function first
  try {
    const { data, error } = await supabase.functions.invoke('evolution-webhook', {
      body: payload,
    });

    if (!error && data?.message) {
      return {
        message: data.message,
        actionButtons: data.actionButtons ?? MOCK_BUTTONS,
        nextStep: data.nextStep ?? detectIntent(payload.message),
        products: data.products ?? []
      };
    }
  } catch {
    // Fall through to mock
  }

  return mockResponse(payload);
};

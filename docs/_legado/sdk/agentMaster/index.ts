import { AgentActionButton, AgentNextStep, AgentProduct, AgentResponsePayload } from '@/types/agent';

export type AgentChannel = 'webchat' | 'whatsapp' | 'instagram' | 'meta_ai';

export interface AgentMasterRequest {
  message: string;
  channel: AgentChannel;
  sessionId: string;
  lead?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  metadata?: Record<string, unknown>;
}

const AGENT_NEXT_STEPS: AgentNextStep[] = ['recruitment', 'client_final', 'support_distributor', 'none'];

export const MASTER_DEFAULT_ACTION_BUTTONS: AgentActionButton[] = [
  { label: 'Ver produtos', value: 'Ver produtos', type: 'message' },
  {
    label: 'ME CADASTRAR',
    value: 'https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario',
    type: 'link',
    url: 'https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario'
  },
  { label: 'WHATSAPP', value: 'whatsapp', type: 'link', url: 'https://wa.me/551189042182' }
];

const cloneDefaultButtons = (): AgentActionButton[] => MASTER_DEFAULT_ACTION_BUTTONS.map((button) => ({ ...button }));

const safeNextStep = (value: unknown): AgentNextStep => {
  if (typeof value === 'string' && AGENT_NEXT_STEPS.includes(value as AgentNextStep)) {
    return value as AgentNextStep;
  }
  return 'none';
};

const sanitizeProduct = (item: unknown): AgentProduct | null => {
  if (typeof item !== 'object' || !item) return null;
  const product = item as Record<string, unknown>;
  const name = typeof product.name === 'string' ? product.name.trim() : '';
  const summary = typeof product.summary === 'string' ? product.summary.trim() : '';
  const url = typeof product.url === 'string' ? product.url : undefined;

  if (!name && !summary) return null;
  return { name: name || summary, summary: summary || name, url };
};

export const normalizeActionButtons = (buttons: AgentActionButton[] | undefined): AgentActionButton[] => {
  if (!Array.isArray(buttons) || !buttons.length) {
    return cloneDefaultButtons();
  }

  return buttons
    .map((button): AgentActionButton => ({
      label: button.label?.trim() || 'Opção Allin',
      value: button.value?.trim() || button.label?.trim() || 'opcao_allin',
      type: (button.type === 'link' ? 'link' : button.type === 'nextStep' ? 'nextStep' : 'message') as 'link' | 'message' | 'nextStep',
      url: button.url
    }))
    .filter((button) => Boolean(button.label && button.value));
};

const extractJsonObject = (text: string): Record<string, unknown> | null => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const buildFallbackResponse = (message: string): AgentResponsePayload => ({
  message: message || 'Agente Allin está analisando sua intenção.',
  actionButtons: cloneDefaultButtons(),
  nextStep: 'none',
  products: []
});

export const parseAgentResponse = (
  raw: unknown,
  fallbackMessage = 'Agente Allin está analisando sua intenção.'
): AgentResponsePayload => {
  if (!raw) {
    return buildFallbackResponse(fallbackMessage);
  }

  let candidate: Record<string, unknown> | null = null;

  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    candidate = raw as Record<string, unknown>;
  } else if (typeof raw === 'string') {
    candidate = extractJsonObject(raw);
    if (!candidate) {
      return buildFallbackResponse(raw.trim() || fallbackMessage);
    }
  }

  if (!candidate) {
    return buildFallbackResponse(fallbackMessage);
  }

  const message =
    typeof candidate.message === 'string' && candidate.message.trim()
      ? candidate.message.trim()
      : fallbackMessage;
  const actionButtons = normalizeActionButtons(candidate.actionButtons as AgentActionButton[]);
  const products = Array.isArray(candidate.products)
    ? candidate.products.map(sanitizeProduct).filter(Boolean) as AgentProduct[]
    : [];

  return {
    message: message || fallbackMessage,
    actionButtons,
    nextStep: safeNextStep(candidate.nextStep),
    products
  };
};

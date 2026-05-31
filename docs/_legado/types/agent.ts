export type AgentNextStep = 'recruitment' | 'client_final' | 'support_distributor' | 'none';

export interface AgentActionButton {
  label: string;
  value: string;
  type?: 'message' | 'link' | 'nextStep';
  url?: string;
}

export interface AgentProduct {
  name: string;
  summary: string;
  url?: string;
}

export interface AgentResponsePayload {
  message: string;
  actionButtons: AgentActionButton[];
  nextStep: AgentNextStep;
  products: AgentProduct[];
}

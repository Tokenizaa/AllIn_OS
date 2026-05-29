import { Permission, UserRole } from '../types/auth.types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin_master: [
    { id: "p1", module: "dashboard", action: "all", description: "Acesso total ao Dashboard executivo" },
    { id: "p2", module: "analytics", action: "all", description: "Ver relatórios e analytics globais" },
    { id: "p3", module: "finance", action: "all", description: "Gerenciar pagamentos, saques e bônus" },
    { id: "p4", module: "support", action: "all", description: "Visualizar e atualizar chamados e KYC" },
    { id: "p5", module: "network", action: "all", description: "Ver árvore unilevel e binária global" },
    { id: "p6", module: "orders", action: "all", description: "Gerenciar todos os pedidos e logística" },
    { id: "p7", module: "products", action: "all", description: "Criar, editar e excluir produtos" },
    { id: "p8", module: "marketing", action: "all", description: "Disparar campanhas e banners corporativos" },
    { id: "p9", module: "settings", action: "all", description: "Modificar regras comissões e gateways" },
    { id: "p10", module: "system", action: "all", description: "Acesso total a auditoria e banco de dados" }
  ],
  finance: [
    { id: "f1", module: "dashboard", action: "read", description: "Visualizar resumos operacionais" },
    { id: "f2", module: "analytics", action: "read", description: "Análise de faturamento e lucro" },
    { id: "f3", module: "finance", action: "manage", description: "Aprovar saques, conciliação de depósitos" },
    { id: "f4", module: "orders", action: "read", description: "Visualizar fluxo de faturamento de pedidos" },
    { id: "f5", module: "settings", action: "read", description: "Auditar regras de comissões de bônus" }
  ],
  support: [
    { id: "s1", module: "dashboard", action: "read", description: "Visualizar chamados pendentes" },
    { id: "s2", module: "support", action: "manage", description: "Responder tickets, aprovar KYC de distribuidores" },
    { id: "s3", module: "orders", action: "write", description: "Rastrear encomendas e atualizar status de entrega" },
    { id: "s4", module: "network", action: "read", description: "Consultar patrocínio e árvore unilevel em disputas" }
  ],
  distributor: [
    { id: "d1", module: "dashboard", action: "read", description: "Ver painel de bônus e estatísticas próprias" },
    { id: "d2", module: "network", action: "read", description: "Ver rede de cadastrados indicados diretos e indiretos" },
    { id: "d3", module: "orders", action: "write", description: "Fazer novos pedidos pessoais e acompanhar entrega" },
    { id: "d4", module: "finance", action: "write", description: "Solicitar transferências e saques das carteiras" }
  ],
  customer: [
    { id: "c1", module: "orders", action: "write", description: "Realizar compras de produtos e acompanhar pedidos" },
    { id: "c2", module: "dashboard", action: "read", description: "Acessar histórico de compras e carteira de cashback" }
  ],
  gestão_admin: [
    { id: "ga1", module: "dashboard", action: "all", description: "Acesso total ao Dashboard executivo" },
    { id: "ga2", module: "analytics", action: "all", description: "Estatísticas gerenciais completas" },
    { id: "ga3", module: "support", action: "all", description: "Gerenciamento de tickets" },
    { id: "ga4", module: "orders", action: "all", description: "Controle operacional de pedidos" },
    { id: "ga5", module: "products", action: "all", description: "Catálogo de produtos" },
    { id: "ga6", module: "marketing", action: "all", description: "Campanhas de Marketing" },
    { id: "ga7", module: "system", action: "read", description: "Verificação de logs" }
  ],
  financeiro: [
    { id: "fin1", module: "dashboard", action: "read", description: "Resumos de faturamento" },
    { id: "fin2", module: "analytics", action: "read", description: "Painéis de faturamento e lucro" },
    { id: "fin3", module: "finance", action: "manage", description: "Controle de saques e liquidações" },
    { id: "fin4", module: "orders", action: "read", description: "Visualização de pedidos faturados" }
  ],
  suporte: [
    { id: "sup1", module: "dashboard", action: "read", description: "Visualizar tickets de suporte" },
    { id: "sup2", module: "support", action: "manage", description: "Responder e gerenciar tickets de suporte" },
    { id: "sup3", module: "orders", action: "read", description: "Rastreamento e detalhes de pedidos" }
  ],
  logística: [
    { id: "log1", module: "dashboard", action: "read", description: "Estatísticas de expedição" },
    { id: "log2", module: "orders", action: "manage", description: "Controle completo de remessas e expedição" },
    { id: "log3", module: "products", action: "read", description: "Consultar estoque e produtos" }
  ],
  marketing: [
    { id: "mkt1", module: "dashboard", action: "read", description: "Visualizar dados básicos" },
    { id: "mkt2", module: "marketing", action: "manage", description: "Gestão completa de campanhas de marketing" },
    { id: "mkt3", module: "products", action: "read", description: "Consulta ao catálogo de produtos" }
  ],
  analytics: [
    { id: "an1", module: "dashboard", action: "read", description: "Visualização de dashboards" },
    { id: "an2", module: "analytics", action: "all", description: "Análises avançadas e relatórios enterprise" }
  ],
  auditor: [
    { id: "aud1", module: "dashboard", action: "read", description: "Visualização de Auditoria" },
    { id: "aud2", module: "analytics", action: "read", description: "Leitura de relatórios de dados" },
    { id: "aud3", module: "finance", action: "read", description: "Auditoria de fluxos de caixa" },
    { id: "aud4", module: "system", action: "read", description: "Auditoria estrita de logs" }
  ],
  operador: [
    { id: "ope1", module: "dashboard", action: "read", description: "Dashboard operacional básico" },
    { id: "ope2", module: "orders", action: "write", description: "Lançamento e edição operacional de pedidos" },
    { id: "ope3", module: "support", action: "read", description: "Leitura de tickets básicos" }
  ]
};

export const getPermissionsByRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (
  role: UserRole,
  module: Permission['module'],
  action: Permission['action'] = 'read'
): boolean => {
  if (role === 'admin_master') return true;
  
  const permissions = getPermissionsByRole(role);
  return permissions.some(
    (p) => p.module === module && (p.action === 'all' || p.action === 'manage' || p.action === action)
  );
};

export const isAdminRole = (role: UserRole): boolean => {
  return ['admin_master', 'gestão_admin'].includes(role);
};

export const isDistributorRole = (role: UserRole): boolean => {
  return role === 'distributor';
};

export const isCustomerRole = (role: UserRole): boolean => {
  return role === 'customer';
};

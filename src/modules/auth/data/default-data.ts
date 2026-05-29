import { User, DistributorProfile, CustomerReferral, AuditLog, AdminInvite } from '../types/auth.types';

const getOrigin = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://allin.io';
};

export const DEFAULT_USERS: User[] = [
  {
    id: "user-admin-master",
    name: "Dr. Carlos Colussi (Admin Master)",
    email: "admin@allin.io",
    role: "admin_master",
    status: "active",
    active: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    phone: "+55 (11) 99999-1111",
    cpf: "123.456.789-00",
    created_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: "user-finance",
    name: "Ana Letícia (Diretora Financeira)",
    email: "finance@allin.io",
    role: "finance",
    status: "active",
    active: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    phone: "+55 (11) 98888-2222",
    cpf: "222.333.444-55",
    created_at: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: "user-support",
    name: "Bruno Lima (Gerente de Suporte)",
    email: "support@allin.io",
    role: "support",
    status: "active",
    active: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    phone: "+55 (11) 97777-3333",
    cpf: "333.444.555-66",
    created_at: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: "user-distributor",
    name: "Marcus Vinícius (Distribuidor Platinum)",
    email: "distributor@allin.io",
    role: "distributor",
    status: "active",
    active: true,
    referral_code: "marcus",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    phone: "+55 (21) 96666-4444",
    cpf: "444.555.666-77",
    sponsor_id: "user-admin-master",
    created_at: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
    last_login: new Date().toISOString()
  },
  {
    id: "user-customer",
    name: "Thiago Silva (Cliente Final)",
    email: "customer@allin.io",
    role: "customer",
    status: "active",
    active: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    phone: "+55 (11) 95555-5555",
    cpf: "555.666.777-88",
    sponsor_id: "user-distributor",
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    last_login: new Date().toISOString()
  }
];

export const DEFAULT_DISTRIBUTORS: DistributorProfile[] = [
  {
    id: "dist-marcus",
    customer_id: "user-distributor",
    sponsor_id: "user-admin-master",
    referral_code: "marcus",
    referral_link: "https://allin.io/loja/ref/marcus",
    plan_id: "plan-platinum",
    qualification: "Platinum Elite",
    wallet_balance: 14810.00,
    bonus_balance: 4250.00,
    status: "active"
  }
];

export const DEFAULT_REFERRALS: CustomerReferral[] = [
  {
    id: "ref-1",
    distributor_id: "user-distributor",
    customer_id: "user-customer",
    source: "loja_virtual",
    tracking_metadata: {
      clicked_at: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
      landing_url: "/loja/ref/marcus",
      referrer_code: "marcus"
    },
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    user_id: "user-admin-master",
    actor: "admin@allin.io",
    action: "UPDATE_SYSTEM_CONFIG",
    entity: "settings",
    details: "Mudança no percentual do bônus residual de liderança de 5% para 7%.",
    ip_address: "189.12.33.45",
    tenant_id: "tenant-default",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString()
  },
  {
    id: "log-2",
    user_id: "user-finance",
    actor: "finance@allin.io",
    action: "APPROVE_WITHDRAWAL",
    entity: "wallets",
    details: "Saque aprovado de R$ 5.400,00 para o distribuidor ID marcus.",
    ip_address: "191.240.54.120",
    tenant_id: "tenant-default",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "log-3",
    user_id: "user-support",
    actor: "support@allin.io",
    action: "VERIFY_DOCUMENT",
    entity: "customers",
    details: "Verificação de documentos aprovada para o usuário ID user-distributor.",
    ip_address: "201.144.110.2",
    tenant_id: "tenant-default",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export const DEFAULT_ADMIN_INVITES: AdminInvite[] = [
  {
    id: "invite-1",
    email: "mariana.financeiro@allin.io",
    full_name: "Mariana Souza",
    role: "financeiro",
    permissions: ["finance", "orders", "analytics"],
    invite_token: "token-mariana-accepted",
    invite_link: `${window.locanion.oow.lotion.origin}/auth/invite/token-mariana-accepted`,
    invited_by: "admin@allin.io",
    expires_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    accepted_at: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    status: "accepted",
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  },
  {
    id: "invite-2",
    email: "gabriel.suporte@allin.io",
    full_name: "Gabriel Oliveira",
    role: "suporte",
    permissions: ["support", "orders"],
    invite_token: "token-suporte-gabriel",
    invite_link: `${window.location.origin}/auth/invite/token-suporte-gabriel`,
    invited_by: "admin@allin.io",
    expires_at: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
    status: "pending",
    notes: "Contratação para suporte nível 2.",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: "invite-3",
    email: "renato.logistica@allin.io",
    full_name: "Renato Cruz",
    role: "logística",
    permissions: ["orders", "products"],
    invite_token: "token-renato-expired",
    invite_link: `${getOrigin()}/auth/invite/token-renato-expired`,
    invited_by: "admin@allin.io",
    expires_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    status: "expired",
    created_at: new Date(Date.now() - 4 * 24 * 3600000).toISOString()
  },
  {
    id: "invite-4",
    email: "fernanda.marketing@allin.io",
    full_name: "Fernanda Lima",
    role: "marketing",
    permissions: ["marketing"],
    invite_token: "token-fernanda-revoked",
    invite_link: `${getOrigin()}/auth/invite/token-fernanda-revoked`,
    invited_by: "admin@allin.io",
    expires_at: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
    revoked_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    status: "revoked",
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
  }
];

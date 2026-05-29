export type UserRole = 
  | "admin_master" 
  | "finance" 
  | "support" 
  | "distributor" 
  | "customer"
  | "gestão_admin"
  | "financeiro"
  | "suporte"
  | "logística"
  | "marketing"
  | "analytics"
  | "auditor"
  | "operador";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  active: boolean;
  avatar?: string;
  phone?: string;
  cpf?: string;
  sponsor_id?: string;
  referral_code?: string;
  created_at: string;
  last_login?: string;
  permissions_list?: string[];
  updated_at?: string;
}

export interface DistributorProfile {
  id: string;
  customer_id: string;
  sponsor_id: string;
  referral_code: string;
  referral_link: string;
  plan_id: string;
  qualification: string;
  wallet_balance: number;
  bonus_balance: number;
  status: "active" | "pending" | "suspended";
}

export interface CustomerReferral {
  id: string;
  distributor_id: string;
  customer_id: string;
  source: string;
  tracking_metadata: {
    clicked_at?: string;
    landing_url?: string;
    referrer_code?: string;
    device?: string;
  };
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  actor: string;
  action: string;
  entity: string;
  details?: string;
  ip_address?: string;
  tenant_id: string;
  created_at: string;
}

export interface Permission {
  id: string;
  module: "dashboard" | "analytics" | "finance" | "support" | "network" | "orders" | "products" | "marketing" | "settings" | "system";
  action: "read" | "write" | "delete" | "manage" | "all";
  description: string;
}

export interface AdminInvite {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions: string[];
  invite_token: string;
  invite_link: string;
  invited_by: string;
  expires_at: string;
  accepted_at?: string;
  revoked_at?: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  notes?: string;
  metadata?: any;
  created_at: string;
}

export interface ReferralMetadata {
  clicked_at: string;
  landing_url: string;
  referrer_code: string;
  device: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  distributorProfile: DistributorProfile | null;
  activeSponsor: string | null;
  activeReferralMetadata: ReferralMetadata | null;
}

export interface AuthContextType extends AuthState {
  auditLogs: AuditLog[];
  usersList: User[];
  adminInvites: AdminInvite[];
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, role: UserRole, extra?: RegisterExtra) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  updateDistributorProfile: (updates: Partial<DistributorProfile>) => Promise<DistributorProfile>;
  changeUserRole: (userId: string, targetRole: UserRole) => Promise<void>;
  simulateAuditLog: (action: string, entity: string, details?: string) => void;
  clearSponsor: () => void;
  activateDistributorOffice: (planId: string) => Promise<void>;
  addAuditLog: (logInput: any) => void;
  triggerBinomialBonusPay: (points: number, commission: number, value: number) => Promise<void>;
  createAdminInvite: (invite: Omit<AdminInvite, "id" | "invite_token" | "invite_link" | "created_at" | "expires_at" | "status">) => Promise<AdminInvite>;
  revokeAdminInvite: (inviteId: string) => Promise<void>;
  resendAdminInvite: (inviteId: string) => Promise<void>;
  getAdminInviteByToken: (token: string) => AdminInvite | null;
  acceptAdminInvite: (token: string, name: string, password: string) => Promise<User>;
  deleteUserAndInviteSession: (userId: string) => void;
}

export interface RegisterExtra {
  phone?: string;
  cpf?: string;
  sponsor_id?: string;
  password?: string;
}

export interface SessionData {
  user: User;
  expiresAt?: string;
}

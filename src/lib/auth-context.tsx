import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

// --- TYPES & INTERFACES ---

export type UserRole = "admin_master" | "finance" | "support" | "distributor" | "customer";

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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  distributorProfile: DistributorProfile | null;
  activeSponsor: string | null;
  activeReferralMetadata: any | null;
  auditLogs: AuditLog[];
  usersList: User[];
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, role: UserRole, extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  updateDistributorProfile: (updates: Partial<DistributorProfile>) => Promise<DistributorProfile>;
  changeUserRole: (userId: string, targetRole: UserRole) => Promise<void>;
  simulateAuditLog: (action: string, entity: string, details?: string) => void;
  clearSponsor: () => void;
  activateDistributorOffice: (planId: string) => Promise<void>;
  addAuditLog: (logInput: any) => void;
  triggerBinomialBonusPay: (points: number, commission: number, value: number) => Promise<void>;
}

// --- DEFAULT STATE PRE-POPULATION (ENTERPRISE SIMULATOR) ---

const DEFAULT_USERS: User[] = [
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

const DEFAULT_DISTRIBUTORS: DistributorProfile[] = [
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

const DEFAULT_REFERRALS: CustomerReferral[] = [
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

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
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

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [activeSponsor, setActiveSponsor] = useState<string | null>(null);
  const [activeReferralMetadata, setActiveReferralMetadata] = useState<any | null>(null);
  
  const [usersList, setUsersList] = useState<User[]>([]);
  const [distributorsList, setDistributorsList] = useState<DistributorProfile[]>([]);
  const [referralsList, setReferralsList] = useState<CustomerReferral[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Init loads
  useEffect(() => {
    // 1. Initialize Mock Database from LocalStorage (or set defaults)
    const storedUsers = localStorage.getItem("allin_users");
    const storedDistributors = localStorage.getItem("allin_distributors");
    const storedReferrals = localStorage.getItem("allin_referrals");
    const storedLogs = localStorage.getItem("allin_audit_logs");

    let initialUsers = DEFAULT_USERS;
    let initialDistributors = DEFAULT_DISTRIBUTORS;
    let initialReferrals = DEFAULT_REFERRALS;
    let initialLogs = DEFAULT_AUDIT_LOGS;

    if (storedUsers) {
      initialUsers = JSON.parse(storedUsers);
    } else {
      localStorage.setItem("allin_users", JSON.stringify(DEFAULT_USERS));
    }

    if (storedDistributors) {
      initialDistributors = JSON.parse(storedDistributors);
    } else {
      localStorage.setItem("allin_distributors", JSON.stringify(DEFAULT_DISTRIBUTORS));
    }

    if (storedReferrals) {
      initialReferrals = JSON.parse(storedReferrals);
    } else {
      localStorage.setItem("allin_referrals", JSON.stringify(DEFAULT_REFERRALS));
    }

    if (storedLogs) {
      initialLogs = JSON.parse(storedLogs);
    } else {
      localStorage.setItem("allin_audit_logs", JSON.stringify(DEFAULT_AUDIT_LOGS));
    }

    setUsersList(initialUsers);
    setDistributorsList(initialDistributors);
    setReferralsList(initialReferrals);
    setAuditLogs(initialLogs);

    // 2. Fetch Session from LocalStorage
    const savedSession = localStorage.getItem("allin_session");
    if (savedSession) {
      const parsedUser = JSON.parse(savedSession) as User;
      // Fetch latest states from database
      const liveUser = initialUsers.find((u) => u.id === parsedUser.id) || parsedUser;
      setUser(liveUser);
      
      if (liveUser.role === "distributor") {
        const dProf = initialDistributors.find((d) => d.customer_id === liveUser.id) || null;
        setDistributorProfile(dProf);
      }
    }

    // 3. Process URL sponsor tracking (on load)
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref");
    const currentPath = window.location.pathname;
    
    // Check if path is e.g. /loja/ref/marcus or if query ?ref=marcus exists
    let potentialSponsor = refParam;
    if (!potentialSponsor && currentPath.includes("/ref/")) {
      const parts = currentPath.split("/ref/");
      if (parts[1]) {
        potentialSponsor = parts[1].split(/[/?#]/)[0]; // get pure code
      }
    }

    if (potentialSponsor) {
      // Clean potential code and look up active distributor
      const cleanRef = potentialSponsor.trim().toLowerCase();
      // Check if distributor exists with this design code (or handle dynamically/by-default)
      const validDist = initialUsers.find(
        (u) => (u.referral_code?.toLowerCase() === cleanRef || u.id === cleanRef) && u.role === "distributor"
      );
      
      if (validDist) {
        setActiveSponsor(validDist.referral_code || validDist.id);
        const meta = {
          clicked_at: new Date().toISOString(),
          landing_url: window.location.href,
          referrer_code: cleanRef,
          device: typeof navigator !== "undefined" ? navigator.userAgent : "ssr"
        };
        setActiveReferralMetadata(meta);
        localStorage.setItem("allin_active_ref", cleanRef);
        localStorage.setItem("allin_active_ref_meta", JSON.stringify(meta));
        console.log(`[Referral System] Sponsor Intercepted: active sponsor is now ${cleanRef}`);
      }
    } else {
      // Check cached active sponsor
      const cachedRef = localStorage.getItem("allin_active_ref");
      const cachedMeta = localStorage.getItem("allin_active_ref_meta");
      if (cachedRef) {
        setActiveSponsor(cachedRef);
      }
      if (cachedMeta) {
        setActiveReferralMetadata(JSON.parse(cachedMeta));
      }
    }

    setLoading(false);
  }, []);

  // Sync state helpers to persistent local db
  const saveUsersDB = (newUsers: User[]) => {
    setUsersList(newUsers);
    localStorage.setItem("allin_users", JSON.stringify(newUsers));
  };

  const saveDistributorsDB = (newDists: DistributorProfile[]) => {
    setDistributorsList(newDists);
    localStorage.setItem("allin_distributors", JSON.stringify(newDists));
  };

  const saveReferralsDB = (newRefs: CustomerReferral[]) => {
    setReferralsList(newRefs);
    localStorage.setItem("allin_referrals", JSON.stringify(newRefs));
  };

  const saveLogsDB = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs);
    localStorage.setItem("allin_audit_logs", JSON.stringify(newLogs));
  };

  // --- LOGGERS & EVENTS ---

  const simulateAuditLog = (action: string, entity: string, details?: string) => {
    const actorEmail = user ? user.email : "guest@allin.io";
    const userId = user ? user.id : "guest";
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      actor: actorEmail,
      action,
      entity,
      details,
      ip_address: "189.155.20.40", // Simulated static node IP
      tenant_id: "tenant-default",
      created_at: new Date().toISOString()
    };
    const updated = [newLog, ...auditLogs];
    saveLogsDB(updated);
  };

  const addAuditLog = (logInput: any) => {
    const newLog: AuditLog = {
      id: logInput.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: logInput.userId || user?.id || "guest",
      actor: logInput.userName || user?.email || "guest@allin.io",
      action: logInput.action || "PAY_ORDER",
      entity: logInput.module || "orders",
      details: logInput.details || "",
      ip_address: logInput.ip || "189.155.20.40",
      tenant_id: "tenant-default",
      created_at: new Date().toISOString()
    };
    const updated = [newLog, ...auditLogs];
    saveLogsDB(updated);
  };

  const triggerBinomialBonusPay = async (points: number, commission: number, value: number) => {
    const activeSponsorId = activeSponsor || "marcus_lider_platinum";
    
    const updatedDists = distributorsList.map((d) => {
      if (d.referral_code === activeSponsorId || d.id === activeSponsorId || d.customer_id === activeSponsorId) {
        return {
          ...d,
          wallet_balance: d.wallet_balance + commission,
          bonus_balance: d.bonus_balance + points
        };
      }
      return d;
    });
    
    saveDistributorsDB(updatedDists);
    
    if (user) {
      const activeProf = updatedDists.find((d) => d.customer_id === user.id) || null;
      if (activeProf) {
        setDistributorProfile(activeProf);
      }
    }
  };

  // --- AUTH METHODS ---

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    // Simulate API network wait
    await new Promise((resolve) => setTimeout(resolve, 600));

    const found = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setLoading(false);
      throw new Error("Credenciais inválidas: usuário não encontrado.");
    }

    if (found.status === "suspended") {
      setLoading(false);
      throw new Error("Conta bloqueada por políticas de conformidade interna.");
    }

    // Capture sign-in
    const updatedUser: User = {
      ...found,
      last_login: new Date().toISOString()
    };
    
    const index = usersList.findIndex((u) => u.id === found.id);
    const updatedUsers = [...usersList];
    updatedUsers[index] = updatedUser;
    saveUsersDB(updatedUsers);

    setUser(updatedUser);
    localStorage.setItem("allin_session", JSON.stringify(updatedUser));
    
    if (updatedUser.role === "distributor") {
      const dProf = distributorsList.find((d) => d.customer_id === updatedUser.id) || null;
      setDistributorProfile(dProf);
    } else {
      setDistributorProfile(null);
    }

    // Trigger Audit Log
    const logDetails = `Autenticação bem sucedida. Tipo: ${updatedUser.role.toUpperCase()}`;
    const actorEmail = updatedUser.email;
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: updatedUser.id,
      actor: actorEmail,
      action: "LOGIN",
      entity: "auth",
      details: logDetails,
      ip_address: "189.155.20.40",
      tenant_id: "tenant-default",
      created_at: new Date().toISOString()
    };
    saveLogsDB([newLog, ...auditLogs]);

    setLoading(false);
    return updatedUser;
  };

  const register = async (
    name: string,
    email: string,
    role: UserRole,
    extra?: { phone?: string; cpf?: string; sponsor_id?: string; password?: string }
  ): Promise<User> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailExists = usersList.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setLoading(false);
      throw new Error("E-mail já está sendo utilizado.");
    }

    const uniqueId = `user-${Date.now()}`;
    const assignedReferral = role === "distributor" ? name.toLowerCase().replace(/\s+/g, "") : undefined;

    const newUser: User = {
      id: uniqueId,
      name,
      email,
      role,
      status: role === "distributor" ? "pending" : "active", // distributor starts pending (needs onboarding/activation plan!)
      active: role === "distributor" ? false : true,
      phone: extra?.phone,
      cpf: extra?.cpf,
      sponsor_id: extra?.sponsor_id || activeSponsor || undefined,
      referral_code: assignedReferral,
      created_at: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    const newUsers = [...usersList, newUser];
    saveUsersDB(newUsers);

    // If role is distributor, create empty pending profile
    if (role === "distributor") {
      const newDProf: DistributorProfile = {
        id: `dist-${uniqueId}`,
        customer_id: uniqueId,
        sponsor_id: extra?.sponsor_id || activeSponsor || "user-admin-master",
        referral_code: assignedReferral || "code",
        referral_link: `https://allin.io/loja/ref/${assignedReferral}`,
        plan_id: "none",
        qualification: "Associado Pendente",
        wallet_balance: 0,
        bonus_balance: 0,
        status: "pending"
      };
      saveDistributorsDB([...distributorsList, newDProf]);
    }

    // Record Referral Tracking Link linkage (MLM tracking relationship!)
    if (newUser.sponsor_id && role === "customer") {
      const sponsorUser = usersList.find(
        (u) => u.referral_code === newUser.sponsor_id || u.id === newUser.sponsor_id
      );
      
      if (sponsorUser) {
        const newRefConnection: CustomerReferral = {
          id: `ref-${Date.now()}`,
          distributor_id: sponsorUser.id,
          customer_id: uniqueId,
          source: activeReferralMetadata?.landing_url ? "link_ref" : "checkout_cadastro",
          tracking_metadata: activeReferralMetadata || {
            clicked_at: new Date().toISOString(),
            device: "web-direct"
          },
          created_at: new Date().toISOString()
        };
        saveReferralsDB([newRefConnection, ...referralsList]);
      }
    }

    // Set active session for the registered user
    setUser(newUser);
    localStorage.setItem("allin_session", JSON.stringify(newUser));

    if (newUser.role === "distributor") {
      const dProf = distributorsList.find((d) => d.customer_id === newUser.id) || null;
      setDistributorProfile(dProf);
    } else {
      setDistributorProfile(null);
    }

    // Audit log
    const logDetails = `Cadastro de novo usuário com sucesso. Perfil: ${role.toUpperCase()}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: newUser.id,
      actor: newUser.email,
      action: "REGISTER",
      entity: "auth",
      details: logDetails + (newUser.sponsor_id ? ` (Patrocinador: ${newUser.sponsor_id})` : ""),
      ip_address: "189.155.20.40",
      tenant_id: "tenant-default",
      created_at: new Date().toISOString()
    };
    saveLogsDB([newLog, ...auditLogs]);

    setLoading(false);
    return newUser;
  };

  const logout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    if (user) {
      simulateAuditLog("LOGOUT", "auth", `Log-off concluído para ${user.email}`);
    }

    setUser(null);
    setDistributorProfile(null);
    localStorage.removeItem("allin_session");
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) throw new Error("Não autenticado.");

    // Update session user
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("allin_session", JSON.stringify(updatedUser));

    // Update in users database
    const idx = usersList.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      const updatedList = [...usersList];
      updatedList[idx] = { ...updatedList[idx], ...updates, updated_at: new Date().toISOString() } as User;
      saveUsersDB(updatedList);
    }

    simulateAuditLog("UPDATE_PROFILE", "profiles", `Os dados do perfil foram atualizados por ${user.email}.`);
    return updatedUser;
  };

  const updateDistributorProfile = async (updates: Partial<DistributorProfile>): Promise<DistributorProfile> => {
    if (!user || user.role !== "distributor" || !distributorProfile) {
      throw new Error("Perfil de distribuidor incorreto.");
    }

    const updatedProf = { ...distributorProfile, ...updates };
    setDistributorProfile(updatedProf);

    const idx = distributorsList.findIndex((d) => d.customer_id === user.id);
    if (idx !== -1) {
      const updatedList = [...distributorsList];
      updatedList[idx] = updatedProf;
      saveDistributorsDB(updatedList);
    }

    simulateAuditLog("UPDATE_DISTRIBUTOR_PROFILE", "distributor_profiles", `Status / saldo atualizado.`);
    return updatedProf;
  };

  const changeUserRole = async (userId: string, targetRole: UserRole): Promise<void> => {
    if (!user || user.role !== "admin_master") {
      throw new Error("Acesso negado: Requer privilégio Admin Master.");
    }

    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) throw new Error("Usuário alvo não encontrado.");

    const updatedList = usersList.map((u) => {
      if (u.id === userId) {
        return { ...u, role: targetRole, updated_at: new Date().toISOString() };
      }
      return u;
    });

    saveUsersDB(updatedList);
    
    // Audit escalation attempt or privilege modification
    simulateAuditLog(
      "CHANGE_ROLE",
      "user_roles",
      `Alteração de privilégios de ${targetUser.email}. De ${targetUser.role.toUpperCase()} para ${targetRole.toUpperCase()}`
    );

    // If active user updated themselves
    if (user.id === userId) {
      setUser({ ...user, role: targetRole });
      localStorage.setItem("allin_session", JSON.stringify({ ...user, role: targetRole }));
    }
  };

  const clearSponsor = () => {
    setActiveSponsor(null);
    setActiveReferralMetadata(null);
    localStorage.removeItem("allin_active_ref");
    localStorage.removeItem("allin_active_ref_meta");
    simulateAuditLog("CLEAR_SPONSOR", "referrals_cookies", "Cookies/Indicação limpas do navegador.");
  };

  // Complete Onboarding / Select MLM Start Plan
  const activateDistributorOffice = async (planId: string): Promise<void> => {
    if (!user || user.role !== "distributor") {
      throw new Error("Somente distribuidores pendentes podem realizar a ativação do escritório.");
    }

    // Locate plans
    const planNames: Record<string, string> = {
      "plan-starter": "Gold Starter",
      "plan-pro": "Diamond Pro",
      "plan-platinum": "Platinum Supreme"
    };

    const isDistIdx = distributorsList.findIndex((d) => d.customer_id === user.id);
    if (isDistIdx !== -1) {
      const activeProf = distributorsList[isDistIdx];
      const updatedProf: DistributorProfile = {
        ...activeProf,
        plan_id: planId,
        status: "active",
        qualification: planNames[planId] || "Platinum Elite",
        wallet_balance: 50.00, // starting bonus!
        bonus_balance: 20.00
      };
      
      const newDists = [...distributorsList];
      newDists[isDistIdx] = updatedProf;
      saveDistributorsDB(newDists);
      setDistributorProfile(updatedProf);
    }

    // Put user as fully active
    const usersIdx = usersList.findIndex((u) => u.id === user.id);
    if (usersIdx !== -1) {
      const updatedUser: User = {
        ...usersList[usersIdx],
        status: "active",
        active: true
      };
      
      const newUsers = [...usersList];
      newUsers[usersIdx] = updatedUser;
      saveUsersDB(newUsers);
      setUser(updatedUser);
      localStorage.setItem("allin_session", JSON.stringify(updatedUser));
    }

    simulateAuditLog(
      "ACTIVATE_DISTRIBUTOR_OFFICE",
      "distributor_profiles",
      `Ativação de escritório comercial de distribuidor bem-sucedida. Plano comprado: ${planNames[planId] || planId}`
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        distributorProfile,
        activeSponsor,
        activeReferralMetadata,
        auditLogs,
        usersList,
        login,
        register,
        logout,
        updateProfile,
        updateDistributorProfile,
        changeUserRole,
        simulateAuditLog,
        clearSponsor,
        activateDistributorOffice,
        addAuditLog,
        triggerBinomialBonusPay
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};

// --- PERMISSION SYSTEM & GUARDIANS ---

export const usePermissions = () => {
  const { user } = useAuth();
  
  const getPermissions = (): Permission[] => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  const hasPermission = (module: Permission["module"], action: Permission["action"] = "read"): boolean => {
    if (!user) return false;
    if (user.role === "admin_master") return true; // full global access
    
    const perms = getPermissions();
    return perms.some(
      (p) => p.module === module && (p.action === "all" || p.action === "manage" || p.action === action)
    );
  };

  return {
    permissions: getPermissions(),
    hasPermission,
    isLoading: false,
    role: user?.role || null
  };
};

// --- AUTH ROUTE GUARDS ---

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: { module: Permission["module"]; action?: Permission["action"] };
}

export const RouteGuard: React.FC<GuardProps> = ({ children, allowedRoles, requiredPermission }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to Login page and preserve return url
        navigate({
          to: "/login",
          search: { redirect: location.pathname }
        });
        return;
      }

      // Check role permissions
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role mismatch redirect to their respective primary view
        if (user.role === "distributor") {
          navigate({ to: "/office" });
        } else if (user.role === "customer") {
          navigate({ to: "/store" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      // Check specific modular permission
      if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action || "read")) {
        // No permission error card redirect or similar
        navigate({ to: "/" });
      }
    }
  }, [user, loading, allowedRoles, requiredPermission, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          <div className="absolute h-6 w-6 animate-ping rounded-full bg-primary/20" />
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Iniciando ambiente de segurança...</p>
      </div>
    );
  }

  // Double check authorization
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action || "read")) return null;

  return <>{children}</>;
};

export const RoleGuard: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[]; fallback?: React.ReactNode }> = ({
  children,
  allowedRoles,
  fallback = null
}) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  module: Permission["module"];
  action?: Permission["action"];
  fallback?: React.ReactNode;
}> = ({ children, module, action = "read", fallback = null }) => {
  const { hasPermission } = usePermissions();
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

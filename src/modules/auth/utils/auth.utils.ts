import { User, DistributorProfile, CustomerReferral, AuditLog, AdminInvite } from '../types/auth.types';

const STORAGE_KEYS = {
  SESSION: 'allin_session',
  USERS: 'allin_users',
  DISTRIBUTORS: 'allin_distributors',
  REFERRALS: 'allin_referrals',
  AUDIT_LOGS: 'allin_audit_logs',
  INVITES: 'allin_invites',
  ACTIVE_REF: 'allin_active_ref',
  ACTIVE_REF_META: 'allin_active_ref_meta'
} as const;

const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const safeGetItem = (key: string): string | null => {
  if (!isClient) return null;
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  if (!isClient) return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
};

const safeRemoveItem = (key: string): void => {
  if (!isClient) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
  }
};

export const storageUtils = {
  getSession: (): User | null => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.SESSION);
      if (stored && stored !== 'undefined') {
        return JSON.parse(stored) as User;
      }
    } catch (e) {
      console.error('Error parsing session:', e);
      safeRemoveItem(STORAGE_KEYS.SESSION);
    }
    return null;
  },

  saveSession: (user: User): void => {
    safeSetItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  clearSession: (): void => {
    safeRemoveItem(STORAGE_KEYS.SESSION);
  },

  getUsers: (): User[] => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing users:', e);
    }
    return [];
  },

  saveUsers: (users: User[]): void => {
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getDistributors: (): DistributorProfile[] => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.DISTRIBUTORS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing distributors:', e);
    }
    return [];
  },

  saveDistributors: (distributors: DistributorProfile[]): void => {
    safeSetItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(distributors));
  },

  getReferrals: (): CustomerReferral[] => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.REFERRALS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing referrals:', e);
    }
    return [];
  },

  saveReferrals: (referrals: CustomerReferral[]): void => {
    safeSetItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  },

  getAuditLogs: (): AuditLog[] => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing audit logs:', e);
    }
    return [];
  },

  saveAuditLogs: (logs: AuditLog[]): void => {
    safeSetItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  getInvites: (): AdminInvite[] => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.INVITES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing invites:', e);
    }
    return [];
  },

  saveInvites: (invites: AdminInvite[]): void => {
    safeSetItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));
  },

  getActiveReferral: (): string | null => {
    return safeGetItem(STORAGE_KEYS.ACTIVE_REF);
  },

  saveActiveReferral: (ref: string): void => {
    safeSetItem(STORAGE_KEYS.ACTIVE_REF, ref);
  },

  clearActiveReferral: (): void => {
    safeRemoveItem(STORAGE_KEYS.ACTIVE_REF);
  },

  getActiveReferralMetadata: (): any | null => {
    try {
      const stored = safeGetItem(STORAGE_KEYS.ACTIVE_REF_META);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing referral metadata:', e);
      safeRemoveItem(STORAGE_KEYS.ACTIVE_REF_META);
    }
    return null;
  },

  saveActiveReferralMetadata: (metadata: any): void => {
    safeSetItem(STORAGE_KEYS.ACTIVE_REF_META, JSON.stringify(metadata));
  },

  clearActiveReferralMetadata: (): void => {
    safeRemoveItem(STORAGE_KEYS.ACTIVE_REF_META);
  }
};

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
};

export const generateToken = (): string => {
  return `inv-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

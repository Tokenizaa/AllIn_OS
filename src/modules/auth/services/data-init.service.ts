import { storageUtils } from '../utils/auth.utils';
import {
  DEFAULT_USERS,
  DEFAULT_DISTRIBUTORS,
  DEFAULT_REFERRALS,
  DEFAULT_AUDIT_LOGS,
  DEFAULT_ADMIN_INVITES
} from '../data/default-data';
import { AdminInvite } from '../types/auth.types';

export class DataInitService {
  initializeDefaultData(): void {
    this.initializeUsers();
    this.initializeDistributors();
    this.initializeReferrals();
    this.initializeAuditLogs();
    this.initializeAdminInvites();
  }

  private initializeUsers(): void {
    const storedUsers = storageUtils.getUsers();
    if (storedUsers.length === 0) {
      storageUtils.saveUsers(DEFAULT_USERS);
    }
  }

  private initializeDistributors(): void {
    const storedDistributors = storageUtils.getDistributors();
    if (storedDistributors.length === 0) {
      storageUtils.saveDistributors(DEFAULT_DISTRIBUTORS);
    }
  }

  private initializeReferrals(): void {
    const storedReferrals = storageUtils.getReferrals();
    if (storedReferrals.length === 0) {
      storageUtils.saveReferrals(DEFAULT_REFERRALS);
    }
  }

  private initializeAuditLogs(): void {
    const storedLogs = storageUtils.getAuditLogs();
    if (storedLogs.length === 0) {
      storageUtils.saveAuditLogs(DEFAULT_AUDIT_LOGS);
    }
  }

  private initializeAdminInvites(): void {
    const storedInvites = storageUtils.getInvites();
    
    if (storedInvites.length === 0) {
      storageUtils.saveInvites(DEFAULT_ADMIN_INVITES);
      return;
    }

    const checkedInvites = storedInvites.map((inv: AdminInvite) => {
      if (inv.status === 'pending' && new Date(inv.expires_at) < new Date()) {
        return { ...inv, status: 'expired' as const };
      }
      return inv;
    });

    storageUtils.saveInvites(checkedInvites);
  }
}

export const dataInitService = new DataInitService();

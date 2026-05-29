import { AuthContextType, UserRole, RegisterExtra } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { useSession } from './useSession';
import { useDistributorContext } from '../context/DistributorProvider';
import { distributorService } from '../services/distributor.service';
import { storageUtils } from '../utils/auth.utils';
import { AuditLog, AdminInvite } from '../types/auth.types';
import { generateId } from '../utils/auth.utils';
import { customerService } from '../services/customer.service';

export const useAuth = (): AuthContextType => {
  const session = useSession();
  const distributorContext = useDistributorContext();

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    
    session.saveSession(user);
    
    if (user.role === 'distributor') {
      const dProf = distributorService.getDistributorProfile(user.id);
      distributorContext.setDistributorProfile(dProf);
    } else {
      distributorContext.setDistributorProfile(null);
    }

    return user;
  };

  const register = async (
    name: string,
    email: string,
    role: UserRole,
    extra?: RegisterExtra
  ) => {
    const user = await authService.register(
      name,
      email,
      role,
      extra,
      distributorContext.activeSponsor || undefined
    );

    session.saveSession(user);

    if (user.role === 'distributor') {
      const dProf = distributorService.getDistributorProfile(user.id);
      distributorContext.setDistributorProfile(dProf);
    } else {
      distributorContext.setDistributorProfile(null);
    }

    if (user.sponsor_id && role === 'customer') {
      const users = storageUtils.getUsers();
      const sponsorUser = users.find(
        (u) => u.referral_code === user.sponsor_id || u.id === user.sponsor_id
      );

      if (sponsorUser) {
        customerService.createReferral(
          sponsorUser.id,
          user.id,
          distributorContext.activeReferralMetadata
        );
      }
    }

    return user;
  };

  const logout = async () => {
    await authService.logout();
    session.clearSession();
    distributorContext.setDistributorProfile(null);
  };

  const updateProfile = async (updates: Partial<typeof session.user>) => {
    if (!session.user) throw new Error('Não autenticado.');

    const updatedUser = await authService.updateProfile(session.user.id, updates);
    session.saveSession(updatedUser);

    return updatedUser;
  };

  const updateDistributorProfile = async (updates: Partial<typeof distributorContext.distributorProfile>) => {
    if (!session.user || session.user.role !== 'distributor' || !distributorContext.distributorProfile) {
      throw new Error('Perfil de distribuidor incorreto.');
    }

    const updatedProf = await distributorService.updateDistributorProfile(session.user.id, updates);
    distributorContext.setDistributorProfile(updatedProf);

    return updatedProf;
  };

  const changeUserRole = async (userId: string, targetRole: UserRole) => {
    if (!session.user || session.user.role !== 'admin_master') {
      throw new Error('Acesso negado: Requer privilégio Admin Master.');
    }

    await authService.changeUserRole(session.user.id, userId, targetRole);

    if (session.user.id === userId) {
      const updatedUser = { ...session.user, role: targetRole };
      session.saveSession(updatedUser);
    }
  };

  const simulateAuditLog = (action: string, entity: string, details?: string) => {
    const actorEmail = session.user ? session.user.email : 'guest@allin.io';
    const userId = session.user ? session.user.id : 'guest';
    const newLog: AuditLog = {
      id: generateId('log'),
      user_id: userId,
      actor: actorEmail,
      action,
      entity,
      details,
      ip_address: '189.155.20.40',
      tenant_id: 'tenant-default',
      created_at: new Date().toISOString()
    };
    const logs = storageUtils.getAuditLogs();
    storageUtils.saveAuditLogs([newLog, ...logs]);
  };

  const clearSponsor = () => {
    distributorContext.clearSponsor();
  };

  const activateDistributorOffice = async (planId: string) => {
    if (!session.user || session.user.role !== 'distributor') {
      throw new Error('Somente distribuidores pendentes podem realizar a ativação do escritório.');
    }

    const updatedProf = await distributorService.activateDistributorOffice(session.user.id, planId);
    distributorContext.setDistributorProfile(updatedProf);

    const updatedUser = await authService.updateProfile(session.user.id, {
      status: 'active',
      active: true
    });
    session.saveSession(updatedUser);

    simulateAuditLog(
      'ACTIVATE_DISTRIBUTOR_OFFICE',
      'distributor_profiles',
      `Ativação de escritório comercial de distribuidor bem-sucedida. Plano comprado: ${planId}`
    );
  };

  const addAuditLog = (logInput: any) => {
    const newLog: AuditLog = {
      id: logInput.id || generateId('log'),
      user_id: logInput.userId || session.user?.id || 'guest',
      actor: logInput.userName || session.user?.email || 'guest@allin.io',
      action: logInput.action || 'PAY_ORDER',
      entity: logInput.module || 'orders',
      details: logInput.details || '',
      ip_address: logInput.ip || '189.155.20.40',
      tenant_id: 'tenant-default',
      created_at: new Date().toISOString()
    };
    const logs = storageUtils.getAuditLogs();
    storageUtils.saveAuditLogs([newLog, ...logs]);
  };

  const triggerBinomialBonusPay = async (points: number, commission: number, value: number) => {
    const activeSponsorId = distributorContext.activeSponsor || 'marcus_lider_platinum';
    await distributorService.triggerBinomialBonusPay(activeSponsorId, points, commission);

    if (session.user) {
      const dProf = distributorService.getDistributorProfile(session.user.id);
      distributorContext.setDistributorProfile(dProf);
    }
  };

  const createAdminInvite = async (invite: Omit<AdminInvite, 'id' | 'invite_token' | 'invite_link' | 'created_at' | 'expires_at' | 'status'>) => {
    const token = generateId('inv');
    const inviteLink = `${window.location.origin}/auth/invite/${token}`;
    const expiresAt = new Date(Date.now() + 48 * 3600000).toISOString();

    const newInvite: AdminInvite = {
      id: generateId('invite'),
      email: invite.email.toLowerCase().trim(),
      full_name: invite.full_name,
      role: invite.role,
      permissions: invite.permissions || [],
      invite_token: token,
      invite_link: inviteLink,
      invited_by: session.user?.email || 'admin@allin.io',
      expires_at: expiresAt,
      status: 'pending',
      notes: invite.notes,
      created_at: new Date().toISOString()
    };

    const invites = storageUtils.getInvites();
    storageUtils.saveInvites([newInvite, ...invites]);

    simulateAuditLog(
      'CREATE_ADMIN_INVITE',
      'admin_invites',
      `Convite criado para ${newInvite.email} com a role: ${newInvite.role.toUpperCase()}.`
    );

    return newInvite;
  };

  const revokeAdminInvite = async (inviteId: string) => {
    const invites = storageUtils.getInvites();
    const updated = invites.map(inv => {
      if (inv.id === inviteId) {
        return { ...inv, status: 'revoked' as const, revoked_at: new Date().toISOString() };
      }
      return inv;
    });
    storageUtils.saveInvites(updated);

    const matchObj = invites.find(inv => inv.id === inviteId);
    simulateAuditLog(
      'REVOKE_ADMIN_INVITE',
      'admin_invites',
      `Convite de Id: ${inviteId} (${matchObj?.email || ''}) revogado com sucesso.`
    );
  };

  const resendAdminInvite = async (inviteId: string) => {
    const invites = storageUtils.getInvites();
    const updated = invites.map(inv => {
      if (inv.id === inviteId) {
        const token = generateId('inv');
        return {
          ...inv,
          invite_token: token,
          invite_link: `${window.location.origin}/auth/invite/${token}`,
          expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
          status: 'pending' as const,
          created_at: new Date().toISOString()
        };
      }
      return inv;
    });
    storageUtils.saveInvites(updated);

    const matchObj = invites.find(inv => inv.id === inviteId);
    simulateAuditLog(
      'RESEND_ADMIN_INVITE',
      'admin_invites',
      `Convite reenviado e renovado por 48h para ${matchObj?.email || ''}.`
    );
  };

  const getAdminInviteByToken = (token: string): AdminInvite | null => {
    const invites = storageUtils.getInvites();
    const found = invites.find(inv => inv.invite_token === token);
    if (!found) return null;
    if (found.status === 'pending' && new Date(found.expires_at) < new Date()) {
      return { ...found, status: 'expired' };
    }
    return found;
  };

  const acceptAdminInvite = async (token: string, name: string, password: string) => {
    const invites = storageUtils.getInvites();
    const invite = invites.find(inv => inv.invite_token === token);
    if (!invite) throw new Error('Convite inválido ou token inexistente.');

    if (invite.status === 'revoked') throw new Error('Acesso negado: Este convite foi cancelado pelo administrador.');
    if (invite.status === 'accepted') throw new Error('Acesso negado: Este convite já foi utilizado para ativar uma conta.');
    if (new Date(invite.expires_at) < new Date()) throw new Error('Acesso negado: A validade deste convite expirou.');

    const newUser = await authService.register(name, invite.email, invite.role);

    const updatedInvites = invites.map(inv => {
      if (inv.invite_token === token) {
        return { ...inv, status: 'accepted' as const, accepted_at: new Date().toISOString() };
      }
      return inv;
    });
    storageUtils.saveInvites(updatedInvites);

    session.saveSession(newUser);

    simulateAuditLog(
      'ACCEPT_INVITE',
      'admin_invites',
      `Administrador ativado com sucesso: ${newUser.name} em cargo de ${newUser.role.toUpperCase()}`
    );

    return newUser;
  };

  const deleteUserAndInviteSession = (userId: string) => {
    authService.deleteUser(userId);
  };

  return {
    user: session.user,
    loading: session.loading,
    distributorProfile: distributorContext.distributorProfile,
    activeSponsor: distributorContext.activeSponsor,
    activeReferralMetadata: distributorContext.activeReferralMetadata,
    auditLogs: storageUtils.getAuditLogs(),
    usersList: storageUtils.getUsers(),
    adminInvites: storageUtils.getInvites(),
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
    triggerBinomialBonusPay,
    createAdminInvite,
    revokeAdminInvite,
    resendAdminInvite,
    getAdminInviteByToken,
    acceptAdminInvite,
    deleteUserAndInviteSession
  };
};

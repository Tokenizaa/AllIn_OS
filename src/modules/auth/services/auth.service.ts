import { User, UserRole, DistributorProfile, RegisterExtra } from '../types/auth.types';
import { storageUtils, generateId, delay } from '../utils/auth.utils';

export class AuthService {
  async login(email: string, password: string): Promise<User> {
    await delay(600);

    const users = storageUtils.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      throw new Error('Credenciais inválidas: usuário não encontrado.');
    }

    if (found.status === 'suspended') {
      throw new Error('Conta bloqueada por políticas de conformidade interna.');
    }

    const updatedUser: User = {
      ...found,
      last_login: new Date().toISOString()
    };

    const index = users.findIndex((u) => u.id === found.id);
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    storageUtils.saveUsers(updatedUsers);

    storageUtils.saveSession(updatedUser);

    return updatedUser;
  }

  async register(
    name: string,
    email: string,
    role: UserRole,
    extra?: RegisterExtra,
    activeSponsor?: string
  ): Promise<User> {
    await delay(800);

    const users = storageUtils.getUsers();
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      throw new Error('E-mail já está sendo utilizado.');
    }

    const uniqueId = generateId('user');
    const assignedReferral = role === 'distributor' ? name.toLowerCase().replace(/\s+/g, '') : undefined;

    const newUser: User = {
      id: uniqueId,
      name,
      email,
      role,
      status: role === 'distributor' ? 'pending' : 'active',
      active: role === 'distributor' ? false : true,
      phone: extra?.phone,
      cpf: extra?.cpf,
      sponsor_id: extra?.sponsor_id || activeSponsor || undefined,
      referral_code: assignedReferral,
      created_at: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    const newUsers = [...users, newUser];
    storageUtils.saveUsers(newUsers);

    if (role === 'distributor') {
      const distributors = storageUtils.getDistributors();
      const newDProf: DistributorProfile = {
        id: generateId('dist'),
        customer_id: uniqueId,
        sponsor_id: extra?.sponsor_id || activeSponsor || 'user-admin-master',
        referral_code: assignedReferral || 'code',
        referral_link: `https://allin.io/loja/ref/${assignedReferral}`,
        plan_id: 'none',
        qualification: 'Associado Pendente',
        wallet_balance: 0,
        bonus_balance: 0,
        status: 'pending'
      };
      storageUtils.saveDistributors([...distributors, newDProf]);
    }

    storageUtils.saveSession(newUser);

    return newUser;
  }

  async logout(): Promise<void> {
    await delay(400);
    storageUtils.clearSession();
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = storageUtils.getUsers();
    const idx = users.findIndex((u) => u.id === userId);

    if (idx === -1) {
      throw new Error('Usuário não encontrado.');
    }

    const updatedList = [...users];
    updatedList[idx] = { ...updatedList[idx], ...updates, updated_at: new Date().toISOString() } as User;
    storageUtils.saveUsers(updatedList);

    const session = storageUtils.getSession();
    if (session && session.id === userId) {
      const updatedSession = { ...session, ...updates };
      storageUtils.saveSession(updatedSession);
      return updatedSession;
    }

    return updatedList[idx];
  }

  async changeUserRole(actorUserId: string, targetUserId: string, targetRole: UserRole): Promise<void> {
    const users = storageUtils.getUsers();
    const actor = users.find((u) => u.id === actorUserId);

    if (!actor || actor.role !== 'admin_master') {
      throw new Error('Acesso negado: Requer privilégio Admin Master.');
    }

    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('Usuário alvo não encontrado.');
    }

    const updatedList = users.map((u) => {
      if (u.id === targetUserId) {
        return { ...u, role: targetRole, updated_at: new Date().toISOString() };
      }
      return u;
    });

    storageUtils.saveUsers(updatedList);

    const session = storageUtils.getSession();
    if (session && session.id === targetUserId) {
      const updatedSession = { ...session, role: targetRole };
      storageUtils.saveSession(updatedSession);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const users = storageUtils.getUsers();
    const filteredUsers = users.filter((u) => u.id !== userId);
    storageUtils.saveUsers(filteredUsers);
  }
}

export const authService = new AuthService();

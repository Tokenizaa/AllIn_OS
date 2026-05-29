import { User } from '../types/auth.types';
import { storageUtils } from '../utils/auth.utils';

export class SessionService {
  async restoreSession(): Promise<User | null> {
    const session = storageUtils.getSession();
    
    if (!session || !session.id) {
      return null;
    }

    const users = storageUtils.getUsers();
    const liveUser = users.find((u) => u.id === session.id) || session;

    return liveUser;
  }

  saveSession(user: User): void {
    storageUtils.saveSession(user);
  }

  clearSession(): void {
    storageUtils.clearSession();
  }

  isAuthenticated(): boolean {
    const session = storageUtils.getSession();
    return session !== null && session.id !== undefined;
  }

  getCurrentUser(): User | null {
    return storageUtils.getSession();
  }
}

export const sessionService = new SessionService();

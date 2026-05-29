import { User } from './auth.types';

export interface SessionState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SessionContextType extends SessionState {
  restoreSession: () => Promise<void>;
  clearSession: () => void;
  saveSession: (user: User) => void;
  isAuthenticated: boolean;
}

import { createContext } from 'react';
import type { AppMode } from '../../core/storage/authStorage';
import type { Session } from './jwt';
import type { LoginForm } from './validation';

export interface AuthContextValue {
  session: Session | null;
  /** null = técnico que aún no eligió modo. */
  mode: AppMode | null;
  isAuthenticated: boolean;
  isTechnician: boolean;
  login: (form: LoginForm) => Promise<void>;
  logout: () => void;
  setMode: (mode: AppMode) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

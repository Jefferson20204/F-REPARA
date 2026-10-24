import { useEffect, useState, type ReactNode } from 'react';
import { subscribeUnauthorized } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { authStorage, type AppMode } from '../../core/storage/authStorage';
import * as authApi from './authApi';
import { AuthContext, type AuthContextValue } from './authContextValue';
import { isAdmin, isTechnician, sessionFromToken, type Session } from './jwt';

interface AuthState {
  session: Session | null;
  mode: AppMode | null;
}

const SIGNED_OUT: AuthState = { session: null, mode: null };

/** Modo inicial para una sesión: un cliente siempre es 'client'; un técnico usa el guardado o debe elegir. */
function resolveMode(session: Session, stored: AppMode | null): AppMode | null {
  if (!isTechnician(session.user)) return 'client';
  return stored;
}

function loadInitialState(): AuthState {
  const token = authStorage.getToken();
  if (token === null) return SIGNED_OUT;

  const session = sessionFromToken(token);
  if (session === null || isAdmin(session.user)) {
    authStorage.clear();
    return SIGNED_OUT;
  }

  const mode = resolveMode(session, authStorage.getMode());
  if (mode === null) authStorage.clearMode();
  else authStorage.setMode(mode);
  return { session, mode };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  // 401 en una ruta protegida: la sesión ya no es válida.
  useEffect(
    () =>
      subscribeUnauthorized(() => {
        authStorage.clear();
        setState(SIGNED_OUT);
      }),
    [],
  );

  async function login(form: Parameters<AuthContextValue['login']>[0]): Promise<void> {
    const token = await authApi.login(form);
    const session = sessionFromToken(token);
    if (session === null) {
      throw new ApiError('invalid-response', 'El token recibido no es válido.');
    }
    if (isAdmin(session.user)) {
      throw new ApiError(
        'client',
        'Las cuentas de administrador ingresan desde el panel web, no desde la app.',
      );
    }

    const mode = resolveMode(session, null);
    authStorage.setToken(token);
    if (mode === null) authStorage.clearMode();
    else authStorage.setMode(mode);
    setState({ session, mode });
  }

  function logout(): void {
    authStorage.clear();
    setState(SIGNED_OUT);
  }

  function setMode(mode: AppMode): void {
    const { session } = state;
    if (session === null) return;
    if (mode === 'technician' && !isTechnician(session.user)) {
      throw new Error('Esta cuenta no está habilitada como técnico.');
    }
    authStorage.setMode(mode);
    setState({ session, mode });
  }

  const value: AuthContextValue = {
    session: state.session,
    mode: state.mode,
    isAuthenticated: state.session !== null,
    isTechnician: state.session !== null && isTechnician(state.session.user),
    login,
    logout,
    setMode,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

import type { AuthContextValue } from './authContextValue';

/** Destino inicial según el estado de sesión y modo. */
export function homePathFor({ session, mode }: Pick<AuthContextValue, 'session' | 'mode'>): string {
  if (session === null) return '/login';
  if (mode === 'client') return '/cliente';
  if (mode === 'technician') return '/tecnico';
  return '/modo';
}

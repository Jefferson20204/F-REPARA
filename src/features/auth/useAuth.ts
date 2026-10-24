import { use } from 'react';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function useAuth(): AuthContextValue {
  const value = use(AuthContext);
  if (value === null) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return value;
}

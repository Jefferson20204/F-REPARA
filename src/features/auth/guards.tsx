import { Navigate, Outlet } from 'react-router';
import type { AppMode } from '../../core/storage/authStorage';
import { homePathFor } from './navigation';
import { useAuth } from './useAuth';

/** Rutas privadas: exige sesión. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Rutas de un modo concreto: el modo activo debe coincidir. */
export function RequireMode({ mode }: { mode: AppMode }) {
  const auth = useAuth();
  return auth.mode === mode ? <Outlet /> : <Navigate to={homePathFor(auth)} replace />;
}

/** Login/registro: si ya hay sesión, redirige a su inicio. Es también quien lleva al selector de modo tras el login. */
export function PublicOnly() {
  const auth = useAuth();
  return auth.isAuthenticated ? <Navigate to={homePathFor(auth)} replace /> : <Outlet />;
}

export function RootRedirect() {
  return <Navigate to={homePathFor(useAuth())} replace />;
}

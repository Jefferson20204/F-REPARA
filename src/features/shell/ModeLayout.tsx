import { Outlet } from 'react-router';
import { useAuth } from '../auth/useAuth';

/** Aplica el tema del modo activo (azul / verde esmeralda) vía data-mode. */
export function ModeLayout() {
  const { mode } = useAuth();
  return (
    <div className="app" data-mode={mode ?? 'client'}>
      <Outlet />
    </div>
  );
}

import { Outlet } from 'react-router';
import { useResource } from '../../core/hooks/useResource';
import { fetchProfile } from './profileApi';
import { ProfileContext } from './profileContextValue';

/** Carga el perfil una sola vez por modo y lo comparte con Home y Perfil. */
export function ProfileLayout() {
  const resource = useResource(fetchProfile);
  return (
    <ProfileContext value={resource}>
      <Outlet />
    </ProfileContext>
  );
}

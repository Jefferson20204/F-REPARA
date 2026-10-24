import { use } from 'react';
import type { Resource } from '../../core/hooks/useResource';
import { ProfileContext } from './profileContextValue';
import type { Profile } from './profileApi';

export function useProfile(): Resource<Profile> {
  const value = use(ProfileContext);
  if (value === null) throw new Error('useProfile debe usarse dentro de <ProfileLayout>.');
  return value;
}

import { createContext } from 'react';
import type { Resource } from '../../core/hooks/useResource';
import type { Profile } from './profileApi';

export const ProfileContext = createContext<Resource<Profile> | null>(null);

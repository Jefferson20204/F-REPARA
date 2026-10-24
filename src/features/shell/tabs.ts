import { Briefcase, House, MessageCircle, User, type LucideIcon } from 'lucide-react';

export interface TabItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const CLIENT_TABS: readonly TabItem[] = [
  { to: '/cliente', label: 'Inicio', icon: House, end: true },
  { to: '/cliente/servicios', label: 'Mis servicios', icon: Briefcase },
  { to: '/cliente/asistente', label: 'Asistente', icon: MessageCircle },
  { to: '/cliente/perfil', label: 'Perfil', icon: User },
];

/* El asistente de IA es una función de cliente, por eso el técnico solo tiene tres pestañas. */
export const TECHNICIAN_TABS: readonly TabItem[] = [
  { to: '/tecnico', label: 'Inicio', icon: House, end: true },
  { to: '/tecnico/servicios', label: 'Mis servicios', icon: Briefcase },
  { to: '/tecnico/perfil', label: 'Perfil', icon: User },
];

import { NavLink } from 'react-router';
import type { TabItem } from './tabs';

export function BottomNav({ tabs }: { tabs: readonly TabItem[] }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

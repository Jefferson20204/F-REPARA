import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import type { TabItem } from './tabs';

export function TabsLayout({ tabs }: { tabs: readonly TabItem[] }) {
  return (
    <div className="shell">
      <main className="shell__content">
        <Outlet />
      </main>
      <BottomNav tabs={tabs} />
    </div>
  );
}

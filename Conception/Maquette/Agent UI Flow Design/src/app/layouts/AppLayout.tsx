import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function AppLayout() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

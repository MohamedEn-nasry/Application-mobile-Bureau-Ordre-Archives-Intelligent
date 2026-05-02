import { Outlet } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function MainLayout() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

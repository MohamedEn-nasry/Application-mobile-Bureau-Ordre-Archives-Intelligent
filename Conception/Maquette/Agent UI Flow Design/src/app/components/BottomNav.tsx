import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Inbox, Send, Bell, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Inbox, label: 'Incoming', path: '/incoming' },
  { icon: Send, label: 'Outgoing', path: '/outgoing' },
  { icon: Bell, label: 'Alerts', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useApp();

  return (
    <div
      className="bg-white border-t border-slate-100 flex items-center justify-around px-2 flex-shrink-0"
      style={{ height: '62px', boxShadow: '0 -1px 12px rgba(0,0,0,0.06)' }}
    >
      {navItems.map(({ icon: Icon, label, path }) => {
        const active = location.pathname.startsWith(path) && (path !== '/dashboard' || location.pathname === '/dashboard');
        const isAlerts = path === '/notifications';

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              active ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <div className="relative">
              <Icon size={21} strokeWidth={active ? 2.5 : 2} />
              {isAlerts && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
              {label}
            </span>
            {active && <div className="w-1 h-1 rounded-full bg-indigo-600 mt-0" />}
          </button>
        );
      })}
    </div>
  );
}

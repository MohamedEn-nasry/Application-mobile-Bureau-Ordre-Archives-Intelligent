import { LayoutDashboard, Mail, Users, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

interface BottomNavProps {
  active: 'dashboard' | 'mail' | 'users' | 'notifications' | 'settings';
}

const tabs = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'mail', label: 'Courrier', icon: Mail, path: '/mail' },
  { id: 'users', label: 'Utilisateurs', icon: Users, path: '/users' },
  { id: 'notifications', label: 'Alertes', icon: Bell, path: '/notifications' },
  { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' },
] as const;

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white border-t border-slate-100 flex items-center shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative"
          >
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}
            <Icon
              size={20}
              className={isActive ? 'text-blue-600' : 'text-slate-400'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-[10px] font-medium tracking-tight ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

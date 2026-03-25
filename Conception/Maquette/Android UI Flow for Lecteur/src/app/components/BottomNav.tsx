import { LayoutDashboard, Mail, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/app/dashboard' },
  { icon: Mail, label: 'Courrier', path: '/app/mail' },
  { icon: Bell, label: 'Alertes', path: '/app/notifications' },
  { icon: User, label: 'Profil', path: '/app/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bg-white border-t border-gray-100 flex items-stretch shrink-0" style={{ height: 64 }}>
      {navItems.map((item) => {
        const active =
          item.path === '/app/dashboard'
            ? location.pathname === '/app/dashboard'
            : location.pathname.startsWith(item.path);
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
            )}
            <Icon
              size={22}
              className={active ? 'text-indigo-600' : 'text-gray-400'}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className={`text-[10px] ${active ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

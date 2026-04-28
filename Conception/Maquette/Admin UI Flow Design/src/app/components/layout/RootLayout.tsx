import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  LogIn, LayoutDashboard, Mail, MailOpen, Send, Users, UserPlus,
  UserCog, Shield, Bell, BarChart3, Settings, User, ChevronRight,
} from 'lucide-react';

const screenGroups = [
  {
    group: 'AUTHENTIFICATION',
    items: [
      { label: 'Connexion Admin', path: '/login', icon: LogIn },
    ],
  },
  {
    group: 'PRINCIPAL',
    items: [
      { label: 'Tableau de Bord', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'COURRIER',
    items: [
      { label: 'Aperçu Courrier', path: '/mail', icon: Mail },
      { label: 'Détail Courrier Entrant', path: '/mail/incoming/IM001', icon: MailOpen },
      { label: 'Détail Courrier Sortant', path: '/mail/outgoing/OM001', icon: Send },
    ],
  },
  {
    group: 'UTILISATEURS',
    items: [
      { label: 'Gestion Utilisateurs', path: '/users', icon: Users },
      { label: 'Créer un Utilisateur', path: '/users/create', icon: UserPlus },
      { label: 'Modifier Utilisateur', path: '/users/edit/u002', icon: UserCog },
    ],
  },
  {
    group: 'SYSTÈME',
    items: [
      { label: 'Rôles & Permissions', path: '/roles', icon: Shield },
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Rapports & Analytiques', path: '/reports', icon: BarChart3 },
      { label: 'Paramètres Système', path: '/settings', icon: Settings },
      { label: 'Profil Admin', path: '/profile', icon: User },
    ],
  },
];

const screenTitles: Record<string, string> = {
  '/login': '01 — Connexion',
  '/dashboard': '02 — Tableau de Bord',
  '/mail': '03 — Courrier',
  '/mail/incoming/IM001': '04 — Détail Entrant',
  '/mail/outgoing/OM001': '05 — Détail Sortant',
  '/users': '06 — Utilisateurs',
  '/users/create': '07 — Créer Utilisateur',
  '/users/edit/u002': '08 — Modifier Utilisateur',
  '/roles': '09 — Rôles',
  '/notifications': '10 — Notifications',
  '/reports': '11 — Rapports',
  '/settings': '12 — Paramètres',
  '/profile': '13 — Profil Admin',
};

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Find current screen index for prev/next navigation
  const allPaths = screenGroups.flatMap((g) => g.items.map((i) => i.path));
  const currentIdx = allPaths.indexOf(currentPath);
  const prevPath = currentIdx > 0 ? allPaths[currentIdx - 1] : null;
  const nextPath = currentIdx < allPaths.length - 1 ? allPaths[currentIdx + 1] : null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg shrink-0 overflow-hidden">
        {/* Branding */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-5 py-5 shrink-0">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">Bureau d'Ordre</p>
              <p className="text-blue-200 text-xs leading-tight">Intelligent</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-blue-100 text-xs font-medium">Prototype Admin UI</p>
            <p className="text-blue-200 text-xs">13 écrans • Flux complet</p>
          </div>
        </div>

        {/* Current screen badge */}
        <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 shrink-0">
          <p className="text-blue-700 text-xs font-semibold truncate">{screenTitles[currentPath] || 'Navigation'}</p>
        </div>

        {/* Screen list */}
        <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
          {screenGroups.map((group) => (
            <div key={group.group} className="mb-1">
              <p className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{group.group}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                  >
                    <Icon size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span className="text-xs font-medium truncate">{item.label}</span>
                    {isActive && <ChevronRight size={11} className="text-white ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0">
          <p className="text-xs text-slate-400 text-center">© 2026 Direction Générale</p>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden p-6 gap-4">
        {/* Screen title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => prevPath && navigate(prevPath)}
            disabled={!prevPath}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${prevPath ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
          >
            <ChevronRight size={14} className="rotate-180" />
          </button>
          <div className="text-center">
            <p className="text-slate-500 text-xs font-medium">Écran {currentIdx + 1} / {allPaths.length}</p>
            <p className="text-slate-800 text-sm font-bold">{screenTitles[currentPath] || 'Admin UI Flow'}</p>
          </div>
          <button
            onClick={() => nextPath && navigate(nextPath)}
            disabled={!nextPath}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${nextPath ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Android Phone mockup */}
        <div className="relative shrink-0" style={{ width: 390, height: 812 }}>
          {/* Phone outer shell */}
          <div
            className="absolute inset-0 rounded-[48px] shadow-2xl shadow-slate-400/40"
            style={{
              background: 'linear-gradient(145deg, #2a2a2a, #111111)',
              padding: '10px',
            }}
          >
            {/* Side buttons - left */}
            <div className="absolute left-[-3px] top-28 w-1 h-8 bg-slate-700 rounded-l-sm" />
            <div className="absolute left-[-3px] top-44 w-1 h-12 bg-slate-700 rounded-l-sm" />
            <div className="absolute left-[-3px] top-60 w-1 h-12 bg-slate-700 rounded-l-sm" />
            {/* Side button - right */}
            <div className="absolute right-[-3px] top-40 w-1 h-16 bg-slate-700 rounded-r-sm" />

            {/* Inner screen */}
            <div className="w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col relative">
              {/* Camera notch — dynamic island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[88px] h-[26px] bg-black rounded-full z-50 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Screen content */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        {/* Quick screen dots */}
        <div className="flex items-center gap-1.5">
          {allPaths.map((path, idx) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`rounded-full transition-all ${currentIdx === idx ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Shield, Settings, Mail, UserPlus, CheckCheck, Bell } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { notifications } from '../../data/mockData';

const notifConfig: Record<string, { icon: React.ReactNode; bg: string; border: string; dot: string }> = {
  security: {
    icon: <Shield size={15} className="text-red-600" />,
    bg: 'bg-red-50',
    border: 'border-red-100',
    dot: 'bg-red-500',
  },
  system: {
    icon: <Settings size={15} className="text-slate-600" />,
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
  },
  mail: {
    icon: <Mail size={15} className="text-blue-600" />,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    dot: 'bg-blue-500',
  },
  user: {
    icon: <UserPlus size={15} className="text-green-600" />,
    bg: 'bg-green-50',
    border: 'border-green-100',
    dot: 'bg-green-500',
  },
};

const tabs = [
  { id: 'all', label: 'Toutes' },
  { id: 'system', label: 'Système' },
  { id: 'mail', label: 'Courrier' },
  { id: 'security', label: 'Sécurité' },
];

export function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [readItems, setReadItems] = useState<Set<string>>(
    new Set(notifications.filter((n) => n.read).map((n) => n.id))
  );

  const markAllRead = () => {
    setReadItems(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadItems((prev) => new Set([...prev, id]));
  };

  const filtered = notifications.filter((n) => activeTab === 'all' || n.type === activeTab);
  const unreadCount = notifications.filter((n) => !readItems.has(n.id)).length;

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 'es' : 'e'}` : 'Tout lu'}
        showBack
        showMore
      />

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-0" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tab.id === 'all' ? unreadCount : notifications.filter(n => n.type === tab.id && !readItems.has(n.id)).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`} style={{ fontSize: '9px' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mark all read */}
      {unreadCount > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-xs text-blue-700">{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</span>
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
            <CheckCheck size={12} /> Tout marquer lu
          </button>
        </div>
      )}

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 pt-3 pb-4 space-y-2.5" style={{ scrollbarWidth: 'none' }}>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Bell size={24} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Aucune notification</p>
            <p className="text-xs text-slate-400 mt-1">Tout est à jour dans cette catégorie</p>
          </div>
        )}

        {filtered.map((notif) => {
          const config = notifConfig[notif.type];
          const isRead = readItems.has(notif.id);

          return (
            <button
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`w-full bg-white rounded-2xl shadow-sm border ${config.border} p-4 text-left active:scale-[0.98] transition-transform relative overflow-hidden`}
            >
              {/* Unread indicator */}
              {!isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl" />
              )}

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-9 h-9 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-xs font-bold leading-tight ${isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </p>
                    {!isRead && (
                      <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0 mt-1`} />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{notif.time}</span>
                    {notif.type === 'mail' && (
                      <span className="text-xs text-blue-600 font-semibold">Voir le courrier →</span>
                    )}
                    {notif.type === 'user' && (
                      <span className="text-xs text-green-600 font-semibold">Voir l'utilisateur →</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav active="notifications" />
    </div>
  );
}

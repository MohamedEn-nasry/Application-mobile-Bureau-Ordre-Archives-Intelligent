import { useState } from 'react';
import { Bell, RefreshCw, Archive, CheckCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { notifications as initialNotifs } from '../mockData';
import type { NotificationItem } from '../types';

const TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'update', label: 'Mises à jour' },
  { id: 'reminder', label: 'Rappels' },
];

const typeIcon = (type: NotificationItem['type']) => {
  if (type === 'archive') return Archive;
  if (type === 'reminder') return Bell;
  return RefreshCw;
};

const typeBg = (type: NotificationItem['type']) => {
  if (type === 'archive') return 'bg-amber-50 text-amber-600';
  if (type === 'reminder') return 'bg-violet-50 text-violet-600';
  return 'bg-blue-50 text-blue-600';
};

const typeLabel = (type: NotificationItem['type']) => {
  if (type === 'archive') return 'Archive';
  if (type === 'reminder') return 'Rappel';
  return 'Mise à jour';
};

export function NotificationsScreen() {
  const [tab, setTab] = useState('all');
  const [notifs, setNotifs] = useState<NotificationItem[]>(initialNotifs);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = notifs.filter((n) => tab === 'all' || n.type === tab);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 px-5 pt-3 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-white text-base font-bold">Notifications</h1>
            {unread > 0 && (
              <p className="text-indigo-200 text-xs">{unread} non lue{unread > 1 ? 's' : ''}</p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5"
            >
              <CheckCheck size={14} className="text-white" />
              <span className="text-white text-xs font-medium">Tout lire</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-indigo-700 px-5 pb-0 shrink-0">
        <div className="flex gap-0 border-b border-indigo-600">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-all relative ${
                tab === t.id ? 'text-white' : 'text-indigo-300'
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-gray-400">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Bell size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium">Aucune notification</p>
          </div>
        ) : (
          <div className="px-4 pt-3 pb-4 space-y-2.5">
            {filtered.map((notif) => {
              const Icon = typeIcon(notif.type);
              const iconStyle = typeBg(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden ${!notif.read ? 'border-l-4 border-l-indigo-500' : ''}`}
                >
                  <div className="flex items-start gap-3 px-3.5 py-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconStyle}`}>
                      <Icon size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className={`text-xs leading-snug flex-1 ${!notif.read ? 'text-gray-900 font-bold' : 'text-gray-700 font-semibold'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${iconStyle}`}>
                          {typeLabel(notif.type)}
                        </span>
                        <span className="text-[10px] text-gray-400">{notif.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="border-t border-gray-50 flex">
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="flex-1 py-2 text-[11px] text-gray-500 font-medium"
                      >
                        Marquer lu
                      </button>
                    )}
                    {notif.relatedId && (
                      <Link
                        to={`/app/mail/${notif.relatedId}`}
                        onClick={() => markRead(notif.id)}
                        className={`flex items-center justify-center gap-1 py-2 text-[11px] text-indigo-600 font-semibold ${!notif.read ? 'border-l border-gray-50 flex-1' : 'w-full'}`}
                      >
                        Voir le courrier <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

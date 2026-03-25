import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, CheckCheck, Clock, RefreshCw, Mail, AlertTriangle } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { useApp } from '../contexts/AppContext';

const tabs = ['All', 'Updates', 'Deadlines'];

const typeIcons: Record<string, { icon: any; bg: string; color: string }> = {
  assignment: { icon: Mail, bg: 'bg-indigo-100', color: 'text-indigo-600' },
  ocr: { icon: RefreshCw, bg: 'bg-amber-100', color: 'text-amber-600' },
  update: { icon: CheckCheck, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  deadline: { icon: AlertTriangle, bg: 'bg-red-100', color: 'text-red-600' },
};

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Updates') return n.type === 'update' || n.type === 'ocr' || n.type === 'assignment';
    if (activeTab === 'Deadlines') return n.type === 'deadline';
    return true;
  });

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #1e1b4b 0%, #4338ca 100%)' }}>
        <StatusBar light />
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <div>
            <h1 className="text-white text-[20px] font-bold">Notifications</h1>
            {unread > 0 && (
              <p className="text-white/70 text-[12px]">{unread} unread</p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 pb-3">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white text-indigo-700'
                  : 'text-white/70'
              }`}
            >
              {tab}
              {tab === 'All' && unread > 0 && (
                <span className="ml-1.5 bg-red-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Bell size={40} className="mb-3 opacity-30" />
            <p className="text-[14px]">No notifications</p>
          </div>
        ) : (
          filtered.map(notif => {
            const cfg = typeIcons[notif.type];
            const Icon = cfg.icon;
            return (
              <button
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.mailId) {
                    if (notif.mailId.startsWith('inc')) {
                      navigate(`/incoming/${notif.mailId}`);
                    } else {
                      navigate(`/outgoing/${notif.mailId}`);
                    }
                  }
                }}
                className={`w-full flex gap-3 p-3.5 rounded-2xl text-left transition-all ${
                  !notif.read ? 'bg-white' : 'bg-white/70'
                }`}
                style={{
                  boxShadow: !notif.read ? '0 2px 12px rgba(0,0,0,0.07)' : '0 1px 6px rgba(0,0,0,0.03)',
                  border: !notif.read ? '1px solid #e0e7ff' : '1px solid transparent',
                }}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                  <Icon size={18} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-[13px] leading-snug ${!notif.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                      {notif.title}
                    </p>
                    <span className="text-slate-400 text-[10px] flex-shrink-0 mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[12px] leading-snug">{notif.message}</p>
                  {notif.mailId && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                        {notif.mailId.toUpperCase().replace('-', ' #')}
                      </span>
                      <span className="text-[10px] text-indigo-400">Tap to open →</span>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

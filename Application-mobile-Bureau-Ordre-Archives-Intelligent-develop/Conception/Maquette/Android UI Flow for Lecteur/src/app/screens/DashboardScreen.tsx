import { Bell, Search, Mail, Archive, Inbox, Send, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { mailItems, notifications, archiveItems, currentUser } from '../mockData';

export function DashboardScreen() {
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;
  const incoming = mailItems.filter((m) => m.type === 'incoming');
  const outgoing = mailItems.filter((m) => m.type === 'outgoing');

  const stats = [
    { label: 'Entrants', value: incoming.length, icon: Inbox, color: 'bg-indigo-50 text-indigo-600', badge: 'bg-indigo-600' },
    { label: 'Sortants', value: outgoing.length, icon: Send, color: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-600' },
    { label: 'Archives', value: archiveItems.length, icon: Archive, color: 'bg-amber-50 text-amber-600', badge: 'bg-amber-600' },
    { label: 'Alertes', value: unread, icon: Bell, color: 'bg-rose-50 text-rose-600', badge: 'bg-rose-500' },
  ];

  const quickActions = [
    { label: 'Rechercher', icon: Search, to: '/app/search', color: 'bg-indigo-600' },
    { label: 'Courriers', icon: Mail, to: '/app/mail', color: 'bg-violet-600' },
    { label: 'Archives', icon: Archive, to: '/app/archive', color: 'bg-emerald-600' },
  ];

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 px-5 pt-3 pb-5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-xs">Espace de consultation</p>
            <h1 className="text-white text-base font-bold">Bureau d'Ordre</h1>
          </div>
          <Link to="/app/notifications" className="relative w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
            <Bell size={18} className="text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ width: 16, height: 16 }}>
                {unread}
              </span>
            )}
          </Link>
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <p className="text-white text-lg font-bold">Bonjour, {currentUser.name.split(' ')[0]} 👋</p>
          <p className="text-indigo-200 text-xs">Mardi 24 mars 2026 · Rôle : Lecteur</p>
        </div>

        {/* Search bar */}
        <button
          onClick={() => navigate('/app/search')}
          className="w-full bg-white/15 rounded-xl px-4 py-2.5 flex items-center gap-3"
        >
          <Search size={16} className="text-indigo-200" />
          <span className="text-indigo-200 text-sm">Rechercher un courrier ou document…</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="px-4 pt-5 pb-6 space-y-5">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2.5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl p-2.5 flex flex-col items-center gap-1 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-gray-900 text-sm font-bold">{s.value}</span>
                  <span className="text-gray-400 text-[10px] text-center leading-tight">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Recent Mail */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-gray-900 text-sm font-bold">Documents récents</h3>
              <Link to="/app/mail" className="text-indigo-600 text-xs font-semibold flex items-center gap-0.5">
                Voir tout <ChevronRight size={13} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {mailItems.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={`/app/mail/${item.id}`}
                  className="bg-white rounded-2xl shadow-sm px-3.5 py-3 flex items-start gap-3 active:scale-[0.98] transition-transform"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'incoming' ? 'bg-indigo-50' : 'bg-emerald-50'}`}>
                    {item.type === 'incoming'
                      ? <Inbox size={17} className="text-indigo-500" />
                      : <Send size={17} className="text-emerald-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.subject}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.type === 'incoming' ? item.sender : item.recipient}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest Updates */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-gray-900 text-sm font-bold">Dernières mises à jour</h3>
              <Link to="/app/notifications" className="text-indigo-600 text-xs font-semibold flex items-center gap-0.5">
                Voir tout <ChevronRight size={13} />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {notifications.slice(0, 3).map((n, i) => (
                <div key={n.id}>
                  <div className="flex items-start gap-3 px-3.5 py-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-indigo-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${n.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{n.date.split(' · ')[0]}</span>
                  </div>
                  {i < 2 && <div className="h-px bg-gray-50 mx-3.5" />}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-gray-900 text-sm font-bold mb-2.5">Accès rapide</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.label}
                    to={a.to}
                    className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform shadow-sm`}
                  >
                    <Icon size={22} className="text-white" />
                    <span className="text-white text-xs font-semibold">{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Trend info */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold">Activité cette semaine</p>
              <p className="text-indigo-100 text-[11px] mt-0.5">
                {mailItems.length} courriers enregistrés · {archiveItems.length} documents archivés
              </p>
            </div>
          </div>

          {/* Recent activity footer */}
          <div className="flex items-center gap-2 text-gray-400 text-[11px]">
            <Clock size={12} />
            <span>Dernière mise à jour : 15 Mar 2024 à 11:15</span>
          </div>

        </div>
      </div>
    </div>
  );
}

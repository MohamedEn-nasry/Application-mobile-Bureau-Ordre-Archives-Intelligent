import { useNavigate } from 'react-router';
import {
  Mail, Send, Clock, Archive, Users, Bell, Search, TrendingUp,
  ChevronRight, MailOpen, UserPlus, FileBarChart2, Settings, Shield,
  ArrowUpRight, ArrowDownLeft,
} from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { BottomNav } from '../layout/BottomNav';
import { dashboardStats, recentActivity } from '../../data/mockData';

const activityIcons: Record<string, React.ReactNode> = {
  mail: <Mail size={13} className="text-blue-600" />,
  archive: <Archive size={13} className="text-purple-600" />,
  'user-plus': <UserPlus size={13} className="text-green-600" />,
  download: <ArrowDownLeft size={13} className="text-amber-600" />,
  eye: <Shield size={13} className="text-slate-600" />,
};

const activityBg: Record<string, string> = {
  mail: 'bg-blue-100',
  archive: 'bg-purple-100',
  'user-plus': 'bg-green-100',
  download: 'bg-amber-100',
  eye: 'bg-slate-100',
};

export function DashboardScreen() {
  const navigate = useNavigate();

  const statsCards = [
    { label: 'Courrier Entrant', value: dashboardStats.incoming, icon: ArrowDownLeft, color: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', change: '+12%' },
    { label: 'Courrier Sortant', value: dashboardStats.outgoing, icon: ArrowUpRight, color: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', change: '+8%' },
    { label: 'En Attente', value: dashboardStats.pending, icon: Clock, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', change: '-3%' },
    { label: 'Archivés', value: dashboardStats.archived, icon: Archive, color: 'bg-slate-600', light: 'bg-slate-50', text: 'text-slate-600', change: '+5%' },
    { label: 'Utilisateurs', value: dashboardStats.users, icon: Users, color: 'bg-green-600', light: 'bg-green-50', text: 'text-green-600', change: '' },
  ];

  const quickActions = [
    { label: 'Gestion\nUtilisateurs', icon: Users, path: '/users', color: 'bg-blue-600' },
    { label: 'Assigner\nRôles', icon: Shield, path: '/roles', color: 'bg-indigo-600' },
    { label: 'Voir\nCourrier', icon: Mail, path: '/mail', color: 'bg-sky-600' },
    { label: 'Rapports', icon: FileBarChart2, path: '/reports', color: 'bg-violet-600' },
    { label: 'Paramètres', icon: Settings, path: '/settings', color: 'bg-slate-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar light />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 px-5 pt-1 pb-5 relative overflow-hidden shrink-0">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-8 w-20 h-20 rounded-full bg-indigo-800/30" />
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AB</span>
            </div>
            <div>
              <p className="text-blue-100 text-xs">Bienvenue,</p>
              <h2 className="text-white text-sm font-bold">Admin Ahmed</h2>
            </div>
          </div>
          <button onClick={() => navigate('/notifications')} className="relative w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
            <Bell size={16} className="text-white" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full border border-indigo-700" />
          </button>
        </div>
        <p className="relative z-10 text-blue-100 text-xs mb-3">Lundi, 24 Mars 2026</p>
        {/* Search bar */}
        <div className="relative z-10">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un courrier, utilisateur..."
            className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 pb-2" style={{ scrollbarWidth: 'none' }}>
        {/* Stats grid */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Vue d'ensemble</h3>
            <button className="text-xs text-blue-600 font-medium flex items-center gap-0.5">Voir tout <ChevronRight size={11} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            {statsCards.slice(0, 4).map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 ${card.light} rounded-xl flex items-center justify-center`}>
                      <Icon size={15} className={card.text} />
                    </div>
                    {card.change && (
                      <span className={`text-xs font-semibold ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                        {card.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{card.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-tight">{card.label}</div>
                </div>
              );
            })}
          </div>
          {/* Users card wide */}
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Utilisateurs Actifs</div>
              <div className="text-xl font-bold text-slate-800">{dashboardStats.users}</div>
            </div>
            <div className="ml-auto flex gap-1">
              {['AB', 'FH', 'KM', 'NB'].map((av) => (
                <div key={av} className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white -ml-2 first:ml-0">
                  <span className="text-blue-700" style={{ fontSize: '8px', fontWeight: 700 }}>{av}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/users')} className="shrink-0 w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
              <ChevronRight size={13} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pt-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Actions Rapides</h3>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} rounded-2xl p-3.5 flex flex-col items-center gap-1.5 shrink-0 w-20 active:scale-95 transition-transform shadow-sm`}
                >
                  <Icon size={20} className="text-white" strokeWidth={2} />
                  <span className="text-white text-center leading-tight whitespace-pre-line" style={{ fontSize: '9px', fontWeight: 600 }}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Activité Récente</h3>
            <button className="text-xs text-blue-600 font-medium flex items-center gap-0.5">Tout voir <ChevronRight size={11} /></button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 px-3.5 py-2.5">
                <div className={`w-7 h-7 rounded-full ${activityBg[activity.icon]} flex items-center justify-center shrink-0`}>
                  {activityIcons[activity.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-600 leading-tight">{activity.user}</p>
                  <p className="text-xs text-slate-500 leading-tight truncate">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending items alert */}
        <div className="px-4 pb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Clock size={17} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-800">34 courriers en attente</p>
              <p className="text-xs text-amber-600 mt-0.5">Nécessitent une action immédiate</p>
            </div>
            <button onClick={() => navigate('/mail')} className="shrink-0 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              Voir
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="dashboard" />
    </div>
  );
}

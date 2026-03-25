import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, UserPlus, MoreVertical, Eye, Edit, UserX, KeyRound, ChevronRight } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { users } from '../../data/mockData';

const roleConfig: Record<string, { bg: string; text: string }> = {
  Admin: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Agent: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Lecteur: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

const avatarColors = [
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-teal-500', 'bg-green-500', 'bg-rose-500',
];

export function UsersManagementScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const displayUsers = users.filter((u) => {
    const matchFilter = activeFilter === 'all' || u.status === activeFilter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const allUsers = [{ id: 'u001', name: 'Ahmed Benali', email: 'admin@bureau-ordre.gov.dz', username: 'admin.ahmed', role: 'Admin', status: 'active', avatar: 'AB', lastActive: 'Aujourd\'hui', department: 'Direction' }, ...users];
  const filteredAll = allUsers.filter((u) => {
    const matchFilter = activeFilter === 'all' || u.status === activeFilter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="relative flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar title="Utilisateurs" subtitle="Gestion des comptes" showMenu showNotification notifCount={1} />

      {/* Stats row */}
      <div className="bg-white px-4 pt-2 pb-3 shrink-0">
        <div className="flex gap-2">
          {[
            { label: 'Total', count: allUsers.length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Actifs', count: allUsers.filter(u => u.status === 'active').length, color: 'bg-green-50 text-green-700' },
            { label: 'Désactivés', count: allUsers.filter(u => u.status === 'disabled').length, color: 'bg-red-50 text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className={`flex-1 rounded-xl py-2 px-3 text-center ${stat.color}`}>
              <div className="text-lg font-bold">{stat.count}</div>
              <div className="text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2 bg-white shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-2 bg-white border-b border-slate-100 shrink-0">
        <div className="flex gap-2">
          {(['all', 'active', 'disabled'] as const).map((f) => {
            const labels = { all: 'Tous', active: 'Actifs', disabled: 'Désactivés' };
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 pt-3 pb-3 space-y-2.5" style={{ scrollbarWidth: 'none' }}>
        {filteredAll.map((user, idx) => {
          const role = roleConfig[user.role] || roleConfig['Lecteur'];
          const avatarBg = avatarColors[idx % avatarColors.length];
          const isMenuOpen = menuOpen === user.id;

          return (
            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 relative">
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full ${avatarBg} flex items-center justify-center shrink-0 relative`}>
                  <span className="text-white text-sm font-bold">{user.avatar}</span>
                  {user.status === 'active' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                  {user.status === 'disabled' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    {user.status === 'disabled' && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Désactivé</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${role.bg} ${role.text}`}>
                      {user.role}
                    </span>
                    <span className="text-xs text-slate-400">{(user as any).department}</span>
                  </div>
                </div>

                {/* Menu button */}
                <button
                  onClick={() => setMenuOpen(isMenuOpen ? null : user.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 shrink-0"
                >
                  <MoreVertical size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-4 top-14 bg-white border border-slate-200 rounded-xl shadow-xl z-20 w-44 overflow-hidden">
                  {[
                    { label: 'Voir profil', icon: Eye, color: 'text-slate-700', action: () => { navigate(`/users/edit/${user.id}`); setMenuOpen(null); } },
                    { label: 'Modifier', icon: Edit, color: 'text-blue-600', action: () => { navigate(`/users/edit/${user.id}`); setMenuOpen(null); } },
                    { label: 'Désactiver', icon: UserX, color: 'text-amber-600', action: () => setMenuOpen(null) },
                    { label: 'Réinit. mot de passe', icon: KeyRound, color: 'text-red-600', action: () => setMenuOpen(null) },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                      >
                        <Icon size={14} className={item.color} />
                        <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAB - Add User */}
      <div className="absolute bottom-20 right-4">
        <button
          onClick={() => navigate('/users/create')}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-300 active:scale-95 transition-transform"
        >
          <UserPlus size={22} className="text-white" />
        </button>
      </div>

      <BottomNav active="users" />
    </div>
  );
}
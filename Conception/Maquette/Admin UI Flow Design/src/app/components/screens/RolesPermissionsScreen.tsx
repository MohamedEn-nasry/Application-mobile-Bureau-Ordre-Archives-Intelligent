import { useNavigate } from 'react-router';
import { Shield, Users, BookOpen, Check, ChevronRight, Lock } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';

const roles = [
  {
    value: 'Admin',
    label: 'Administrateur',
    count: 1,
    icon: Shield,
    gradient: 'from-purple-600 to-purple-700',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-600',
    description: 'Contrôle total du système',
    permissions: [
      { label: 'Accès total au système', granted: true },
      { label: 'Gestion des utilisateurs', granted: true },
      { label: 'Assignation des rôles', granted: true },
      { label: 'Paramètres système', granted: true },
      { label: 'Tout le courrier (lecture/écriture)', granted: true },
      { label: 'Rapports & analytiques', granted: true },
      { label: 'Sauvegarde & archivage', granted: true },
    ],
  },
  {
    value: 'Agent',
    label: 'Agent',
    count: 3,
    icon: Users,
    gradient: 'from-blue-600 to-blue-700',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-600',
    description: 'Gestion du courrier',
    permissions: [
      { label: 'Créer et modifier le courrier', granted: true },
      { label: 'Scanner des documents', granted: true },
      { label: 'Lancer la reconnaissance OCR', granted: true },
      { label: 'Mettre à jour les statuts', granted: true },
      { label: 'Consulter les rapports', granted: true },
      { label: 'Gestion des utilisateurs', granted: false },
      { label: 'Paramètres système', granted: false },
    ],
  },
  {
    value: 'Lecteur',
    label: 'Lecteur',
    count: 3,
    icon: BookOpen,
    gradient: 'from-teal-600 to-teal-700',
    light: 'bg-teal-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    iconBg: 'bg-teal-600',
    description: 'Consultation en lecture seule',
    permissions: [
      { label: 'Consulter le courrier', granted: true },
      { label: 'Rechercher et filtrer', granted: true },
      { label: 'Télécharger les rapports', granted: true },
      { label: 'Modifier le courrier', granted: false },
      { label: 'Scanner / OCR', granted: false },
      { label: 'Gestion des utilisateurs', granted: false },
      { label: 'Paramètres système', granted: false },
    ],
  },
];

export function RolesPermissionsScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar title="Rôles & Permissions" showBack showMore />

      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 pt-3 pb-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {/* Header info */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <Lock size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-white text-sm font-bold">Contrôle d'accès</h2>
              <p className="text-slate-300 text-xs">Système de rôles hiérarchique</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            {roles.map((r) => (
              <div key={r.value} className="flex-1 bg-white/10 rounded-xl p-2 text-center">
                <p className="text-white text-lg font-bold">{r.count}</p>
                <p className="text-slate-300 text-xs">{r.label}s</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role cards */}
        {roles.map((role) => {
          const Icon = role.icon;
          const granted = role.permissions.filter((p) => p.granted);
          const denied = role.permissions.filter((p) => !p.granted);

          return (
            <div key={role.value} className={`bg-white rounded-2xl shadow-sm border ${role.border} overflow-hidden`}>
              {/* Card header */}
              <div className={`bg-gradient-to-r ${role.gradient} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold">{role.label}</h3>
                      <p className="text-white/70 text-xs">{role.description}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-xs font-semibold">{role.count} utilisateur{role.count > 1 ? 's' : ''}</span>
                  </div>
                </div>
                {/* Permission progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs">Niveau d'accès</span>
                    <span className="text-white text-xs font-semibold">{Math.round((granted.length / role.permissions.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${(granted.length / role.permissions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Permissions list */}
              <div className="p-4">
                <div className="space-y-2">
                  {role.permissions.map((perm) => (
                    <div key={perm.label} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${perm.granted ? role.light : 'bg-slate-100'}`}>
                        {perm.granted ? (
                          <Check size={9} className={`${role.badge.split(' ')[1]} `} strokeWidth={3} />
                        ) : (
                          <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
                        )}
                      </div>
                      <p className={`text-xs ${perm.granted ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                        {perm.label}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/users')}
                  className={`mt-4 w-full ${role.light} border ${role.border} rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold ${role.badge.split(' ')[1]}`}
                >
                  Voir les utilisateurs {role.label}s <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <Shield size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Les permissions sont gérées exclusivement par l'Administrateur. Toute modification de rôle est enregistrée dans le journal d'audit.
            </p>
          </div>
        </div>
      </div>

      <BottomNav active="users" />
    </div>
  );
}

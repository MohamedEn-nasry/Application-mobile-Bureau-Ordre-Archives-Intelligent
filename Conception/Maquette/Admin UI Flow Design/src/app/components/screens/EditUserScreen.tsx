import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, KeyRound, UserX, CheckCircle2, Shield, Check } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { users } from '../../data/mockData';

const roles = [
  {
    value: 'Admin', label: 'Administrateur', color: 'bg-purple-100 text-purple-700',
    perms: ['Accès total', 'Gestion utilisateurs', 'Paramètres système', 'Tout le courrier'],
  },
  {
    value: 'Agent', label: 'Agent', color: 'bg-blue-100 text-blue-700',
    perms: ['Créer & modifier courrier', 'Scanner documents', 'Lancer OCR', 'Mettre à jour statuts'],
  },
  {
    value: 'Lecteur', label: 'Lecteur', color: 'bg-teal-100 text-teal-700',
    perms: ['Consultation lecture seule', 'Recherche et filtrage', 'Télécharger rapports'],
  },
];

export function EditUserScreen() {
  const navigate = useNavigate();
  const user = users[0]; // Simulate editing user u002
  const [form, setForm] = useState({ name: user.name, username: user.username, email: user.email, role: user.role, status: user.status });
  const [saved, setSaved] = useState(false);

  const selectedRole = roles.find((r) => r.value === form.role)!;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <StatusBar />
      <div className="bg-white shrink-0">
        <TopBar title="Modifier Utilisateur" subtitle="Assigner un rôle" showBack showMore />
      </div>

      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Profile card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 mx-4 mt-3 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{user.avatar}</span>
            </div>
            <div>
              <h2 className="text-white text-base font-bold">{user.name}</h2>
              <p className="text-blue-100 text-xs mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roles.find(r => r.value === user.role)?.color}`}>
                  {user.role}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {user.status === 'active' ? 'Actif' : 'Désactivé'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-500/50 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-xs text-blue-200">Dernière connexion</p>
              <p className="text-white text-xs font-semibold mt-0.5">{user.lastActive}</p>
            </div>
            <div>
              <p className="text-xs text-blue-200">Département</p>
              <p className="text-white text-xs font-semibold mt-0.5">{user.department}</p>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Informations du compte</p>

          {[
            { label: 'Nom Complet', key: 'name', icon: User, placeholder: 'Nom complet' },
            { label: "Nom d'utilisateur", key: 'username', icon: User, placeholder: 'username' },
            { label: 'Email', key: 'email', icon: Mail, placeholder: 'email@bureau.gov.dz' },
          ].map(({ label, key, icon: Icon, placeholder }) => (
            <div key={key} className="mb-4 last:mb-0">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Role assignment */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rôle Assigné</p>
          <div className="space-y-2">
            {roles.map((role) => {
              const isSelected = form.role === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => setForm({ ...form, role: role.value })}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 border-2 transition-all text-left ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.color}`}>{role.label}</span>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions summary */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-blue-600" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Permissions — {selectedRole.label}
            </p>
          </div>
          <div className="space-y-2">
            {selectedRole.perms.map((perm) => (
              <div key={perm} className="flex items-center gap-2.5">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Check size={9} className="text-blue-600" strokeWidth={3} />
                </div>
                <p className="text-xs text-slate-600">{perm}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account status */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Statut du compte</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Compte actif</p>
              <p className="text-xs text-slate-500">L'utilisateur peut se connecter</p>
            </div>
            <button
              onClick={() => setForm({ ...form, status: form.status === 'active' ? 'disabled' : 'active' })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.status === 'active' ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="mx-4 mt-4">
          <button
            onClick={handleSave}
            className={`w-full rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${saved ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 shadow-blue-200'}`}
          >
            {saved ? <><CheckCircle2 size={16} className="text-white" /> Enregistré !</> : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="mx-4 mt-3 mb-2 border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Zone de danger</p>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left">
              <KeyRound size={14} className="text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">Réinitialiser le mot de passe</p>
            </button>
            <button className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-left">
              <UserX size={14} className="text-red-600 shrink-0" />
              <p className="text-xs font-semibold text-red-600">Désactiver ce compte</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

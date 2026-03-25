import { useState } from 'react';
import { ChevronRight, Key, LogOut, Shield, Mail, Building2, Eye, EyeOff, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { currentUser } from '../mockData';

export function ProfileScreen() {
  const navigate = useNavigate();
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    {
      icon: Key,
      label: 'Changer le mot de passe',
      sublabel: 'Modifier votre mot de passe actuel',
      color: 'bg-indigo-50 text-indigo-600',
      action: () => setChangePwdOpen(true),
    },
    {
      icon: Shield,
      label: 'Sécurité du compte',
      sublabel: 'Options de sécurité et sessions actives',
      color: 'bg-emerald-50 text-emerald-600',
      action: () => {},
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 px-5 pt-3 pb-6 shrink-0">
        <h1 className="text-white text-base font-bold mb-4">Mon Profil</h1>

        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">{currentUser.initials}</span>
            </div>
          </div>
          <div>
            <p className="text-white text-base font-bold">{currentUser.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-white/20 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Eye size={10} />
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="px-4 pt-4 pb-6 space-y-4">

          {/* Info card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Informations du compte</p>
            </div>
            {[
              { icon: Mail, label: 'Email', value: currentUser.email },
              { icon: Building2, label: 'Service', value: currentUser.department },
              { icon: Shield, label: 'Rôle', value: currentUser.role },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <row.icon size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400">{row.label}</p>
                    <p className="text-sm text-gray-800 font-medium truncate">{row.value}</p>
                  </div>
                  {row.label === 'Rôle' && (
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                      Lecture seule
                    </span>
                  )}
                </div>
                {i < arr.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>

          {/* Access info */}
          <div className="bg-indigo-50 rounded-2xl px-4 py-3.5 flex gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <Eye size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-800">Accès Lecteur</p>
              <p className="text-[11px] text-indigo-600 mt-0.5 leading-relaxed">
                Votre rôle est limité à la consultation, la recherche et la visualisation des courriers et documents.
              </p>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Paramètres</p>
            </div>
            {menuItems.map((item, i) => (
              <div key={item.label}>
                <button
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.sublabel}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
                {i < menuItems.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>

          {/* Change password panel */}
          {changePwdOpen && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-indigo-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-800">Changer le mot de passe</p>
                <button onClick={() => setChangePwdOpen(false)} className="text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <div className="px-4 py-4 space-y-3">
                {[
                  { label: 'Mot de passe actuel', value: currentPwd, setter: setCurrentPwd, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                  { label: 'Nouveau mot de passe', value: newPwd, setter: setNewPwd, show: showNew, toggle: () => setShowNew(!showNew) },
                  { label: 'Confirmer le nouveau', value: confirmPwd, setter: setConfirmPwd, show: false, toggle: () => {} },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 pr-10"
                      />
                      {field.label !== 'Confirmer le nouveau' && (
                        <button onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold mt-2 flex items-center justify-center gap-2">
                  <Check size={16} />
                  Confirmer le changement
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          {!logoutConfirm ? (
            <button
              onClick={() => setLogoutConfirm(true)}
              className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3 text-rose-600 active:scale-[0.98] transition-transform"
            >
              <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                <LogOut size={16} />
              </div>
              <span className="text-sm font-semibold">Se déconnecter</span>
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
              <p className="text-sm text-gray-800 font-semibold mb-1">Confirmer la déconnexion ?</p>
              <p className="text-xs text-gray-500 mb-4">Vous devrez vous reconnecter pour accéder à l'application.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2.5 text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-rose-500 text-white rounded-xl py-2.5 text-sm font-semibold"
                >
                  Déconnecter
                </button>
              </div>
            </div>
          )}

          {/* Version */}
          <p className="text-center text-[11px] text-gray-400">
            Intelligent Bureau d'Ordre · v2.4.1
          </p>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

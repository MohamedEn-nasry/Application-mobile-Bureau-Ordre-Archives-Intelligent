import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Camera, Edit3, KeyRound, LogOut, Shield, Mail, Phone, Building2,
  Clock, User, ChevronRight, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { adminUser } from '../../data/mockData';

export function AdminProfileScreen() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const infoItems = [
    { icon: Mail, label: 'Email', value: adminUser.email },
    { icon: Phone, label: 'Téléphone', value: adminUser.phone },
    { icon: Building2, label: 'Département', value: adminUser.department },
    { icon: Clock, label: 'Dernière connexion', value: adminUser.lastLogin },
  ];

  const menuItems = [
    { icon: Edit3, label: 'Modifier le profil', color: 'text-blue-600', bg: 'bg-blue-50', action: () => {} },
    { icon: KeyRound, label: 'Changer le mot de passe', color: 'text-amber-600', bg: 'bg-amber-50', action: () => {} },
    { icon: Shield, label: 'Journaux de sécurité', color: 'text-slate-600', bg: 'bg-slate-50', action: () => {} },
    { icon: LogOut, label: 'Se déconnecter', color: 'text-red-600', bg: 'bg-red-50', action: () => setShowLogoutConfirm(true) },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <StatusBar light />

      {/* Hero header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 pt-1 pb-10 px-6 shrink-0 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-indigo-800/30" />
        <TopBar title="Profil Admin" showBack light />
        <div className="relative z-10 flex flex-col items-center text-center pt-2">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full border-4 border-white/40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{adminUser.avatar}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <h1 className="text-white text-lg font-bold">{adminUser.name}</h1>
          <p className="text-blue-100 text-xs mt-0.5">{adminUser.username}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Shield size={10} /> Administrateur
            </span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> En ligne
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mt-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Quick stats */}
        <div className="mx-4 bg-white rounded-2xl shadow-md shadow-slate-200 border border-slate-100 p-4 mb-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Utilisateurs gérés', value: '6' },
              { label: 'Courriers traités', value: '247' },
              { label: 'Jours actif', value: '183' },
            ].map((stat) => (
              <div key={stat.label} className="py-1">
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400 leading-tight mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info items */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informations du compte</p>
          </div>
          {infoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`flex items-center gap-3 px-4 py-3.5 ${idx < infoItems.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Access info */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accès & Permissions</p>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-800">Rôle: Administrateur</p>
                <p className="text-xs text-purple-600">Accès total au système</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Gestion utilisateurs', 'Paramètres système', 'Tout le courrier', 'Rapports & export'].map((perm) => (
                <div key={perm} className="flex items-center gap-1.5 bg-green-50 rounded-xl px-2.5 py-2">
                  <CheckCircle2 size={11} className="text-green-600 shrink-0" />
                  <span className="text-xs text-green-700 font-medium leading-tight">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action menu */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === menuItems.length - 1;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-50' : ''} ${isLast ? 'border-t border-red-50' : ''}`}
              >
                <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={item.color} />
                </div>
                <p className={`flex-1 text-sm font-semibold ${isLast ? 'text-red-600' : 'text-slate-700'}`}>{item.label}</p>
                <ChevronRight size={14} className="text-slate-300" />
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 pb-2">
          Intelligent Bureau d'Ordre — v2.4.1
        </p>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full px-6 pt-5 pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-1 h-1 w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Se déconnecter ?</h3>
              <p className="text-sm text-slate-500">Vous serez redirigé vers l'écran de connexion.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-red-500 text-white rounded-2xl py-3.5 text-sm font-bold mb-3"
            >
              Se déconnecter
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full border border-slate-200 text-slate-600 rounded-2xl py-3 text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <BottomNav active="settings" />
    </div>
  );
}

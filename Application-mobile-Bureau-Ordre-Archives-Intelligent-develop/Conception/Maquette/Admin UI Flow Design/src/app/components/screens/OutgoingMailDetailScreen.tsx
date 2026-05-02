import { useState } from 'react';
import {
  Paperclip, FileText, Edit3, Archive, UserCog, History,
  CheckCircle2, User, Calendar, Tag, Send, Building2,
} from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { outgoingMail } from '../../data/mockData';

export function OutgoingMailDetailScreen() {
  const mail = outgoingMail[0];
  const [confirmed, setConfirmed] = useState(false);

  const actions = [
    { label: 'Modifier', icon: Edit3, bg: 'bg-blue-600' },
    { label: 'Archiver', icon: Archive, bg: 'bg-slate-600' },
    { label: 'Réassigner', icon: UserCog, bg: 'bg-indigo-600' },
    { label: 'Historique', icon: History, bg: 'bg-teal-600' },
  ];

  const timeline = [
    { label: 'Rédigé', date: '23 Mar 2026 — 14:30', done: true },
    { label: 'Validé par Admin', date: '24 Mar 2026 — 08:00', done: true },
    { label: 'Envoyé', date: '24 Mar 2026 — 08:45', done: true },
    { label: 'Accusé de réception', date: 'En attente', done: false },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <StatusBar />
      <div className="bg-white shrink-0">
        <TopBar title="Courrier Sortant" subtitle={mail.ref} showBack />
      </div>

      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Header card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 mx-4 mt-3 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-xs font-medium mb-0.5">Référence</p>
              <p className="text-white text-sm font-bold tracking-wide">{mail.ref}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-green-100 text-green-700">
              Envoyé
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-indigo-500 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-indigo-200" />
              <span className="text-indigo-100 text-xs">{mail.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={11} className="text-indigo-200" />
              <span className="text-indigo-100 text-xs">{mail.category}</span>
            </div>
          </div>
        </div>

        {/* Recipient / Subject */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={12} className="text-slate-400" />
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Destinataire</p>
            </div>
            <p className="text-sm font-semibold text-slate-800">{mail.recipient}</p>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText size={12} className="text-slate-400" />
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Objet</p>
            </div>
            <p className="text-sm font-semibold text-slate-800">{mail.subject}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Description</p>
          <p className="text-xs text-slate-600 leading-relaxed">{mail.description}</p>
        </div>

        {/* Attachments */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2.5">
            Pièces jointes ({mail.attachments.length})
          </p>
          <div className="space-y-2">
            {mail.attachments.map((att) => (
              <div key={att} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <Paperclip size={13} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{att}</p>
                  <p className="text-xs text-slate-400">PDF • 1.2 MB</p>
                </div>
                <button className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded-lg">Voir</button>
              </div>
            ))}
          </div>
        </div>

        {/* Send status summary */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Send size={14} className="text-indigo-600" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Suivi d'envoi</p>
          </div>
          <div className="relative pl-5">
            {timeline.map((item, idx) => (
              <div key={item.label} className="relative flex items-start gap-3 pb-4 last:pb-0">
                {/* Line */}
                {idx < timeline.length - 1 && (
                  <div className={`absolute left-[-13px] top-5 w-0.5 h-full ${item.done ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                )}
                {/* Dot */}
                <div className={`absolute left-[-16px] top-1 w-2.5 h-2.5 rounded-full border-2 ${item.done ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`} />
                <div>
                  <p className={`text-xs font-semibold ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</p>
                  <p className={`text-xs mt-0.5 ${item.done ? 'text-slate-500' : 'text-slate-300'}`}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mx-4 mt-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2.5">Actions</p>
          <div className="grid grid-cols-4 gap-2.5">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className={`${action.bg} rounded-2xl py-3.5 flex flex-col items-center gap-1.5 active:scale-95 transition-transform shadow-sm`}
                >
                  <Icon size={18} className="text-white" />
                  <span className="text-white text-center leading-tight" style={{ fontSize: '9px', fontWeight: 600 }}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sent by */}
        <div className="mx-4 mt-3 mb-2 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Émis par</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 text-sm font-bold">AB</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Ahmed Benali</p>
              <p className="text-xs text-slate-500">Administrateur</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-green-600">
              <CheckCircle2 size={14} />
              <span className="text-xs font-semibold">Validé</span>
            </div>
          </div>
        </div>

        {/* Confirm receipt */}
        <div className="mx-4 mt-1 mb-2">
          <button
            onClick={() => setConfirmed(!confirmed)}
            className={`w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${confirmed ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}
          >
            <CheckCircle2 size={16} />
            {confirmed ? 'Réception confirmée' : 'Confirmer la réception'}
          </button>
        </div>
      </div>
    </div>
  );
}

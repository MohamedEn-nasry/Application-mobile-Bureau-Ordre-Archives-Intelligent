import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Paperclip, FileText, Edit3, Archive, UserCog, ScanLine, History,
  ChevronDown, CheckCircle2, Clock, Brain, User, Calendar, Tag,
} from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { incomingMail } from '../../data/mockData';

export function IncomingMailDetailScreen() {
  const navigate = useNavigate();
  const mail = incomingMail[0];
  const [status, setStatus] = useState(mail.status);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions = ['Pending', 'Received', 'Archived', 'Reassigned'];
  const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
    Pending: { label: 'En attente', bg: 'bg-amber-100', text: 'text-amber-700' },
    Received: { label: 'Reçu', bg: 'bg-green-100', text: 'text-green-700' },
    Archived: { label: 'Archivé', bg: 'bg-slate-100', text: 'text-slate-600' },
    Reassigned: { label: 'Réassigné', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  };

  const actions = [
    { label: 'Modifier', icon: Edit3, bg: 'bg-blue-600', action: () => {} },
    { label: 'Archiver', icon: Archive, bg: 'bg-slate-600', action: () => {} },
    { label: 'Réassigner', icon: UserCog, bg: 'bg-indigo-600', action: () => {} },
    { label: 'OCR', icon: ScanLine, bg: 'bg-violet-600', action: () => {} },
    { label: 'Historique', icon: History, bg: 'bg-teal-600', action: () => navigate('/mail') },
  ];

  const currentStatus = statusLabels[status];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <StatusBar />
      <div className="bg-white shrink-0">
        <TopBar title="Courrier Entrant" subtitle={mail.ref} showBack />
      </div>

      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Reference Header card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 mx-4 mt-3 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-xs font-medium mb-0.5">Référence</p>
              <p className="text-white text-sm font-bold tracking-wide">{mail.ref}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-500 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-blue-200" />
              <span className="text-blue-100 text-xs">{mail.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={11} className="text-blue-200" />
              <span className="text-blue-100 text-xs">{mail.category}</span>
            </div>
          </div>
        </div>

        {/* Sender / Subject */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <User size={12} className="text-slate-400" />
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Expéditeur</p>
            </div>
            <p className="text-sm font-semibold text-slate-800">{mail.sender}</p>
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
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2.5">Pièces jointes ({mail.attachments.length})</p>
          <div className="space-y-2">
            {mail.attachments.map((att) => (
              <div key={att} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <Paperclip size={13} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{att}</p>
                  <p className="text-xs text-slate-400">PDF • 245 KB</p>
                </div>
                <button className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded-lg">Voir</button>
              </div>
            ))}
          </div>
        </div>

        {/* OCR Section */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Texte OCR extrait</p>
            <button className="flex items-center gap-1 text-xs text-violet-600 font-semibold bg-violet-50 px-2 py-1 rounded-lg">
              <ScanLine size={11} /> Relancer
            </button>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed italic">"{mail.ocrText}..."</p>
          </div>
        </div>

        {/* AI Classification */}
        <div className="mx-4 mt-3 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 shadow-sm border border-violet-100">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <p className="text-xs font-bold text-violet-800 uppercase tracking-wider">Classification IA</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">{mail.classification}</p>
              <p className="text-xs text-slate-500 mt-0.5">Suggestion automatique</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">{mail.confidence}%</p>
              <p className="text-xs text-slate-400">Confiance</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-violet-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${mail.confidence}%` }} />
          </div>
        </div>

        {/* Status change */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Changer le statut</p>
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
            >
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
                {currentStatus.label}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setStatus(opt); setShowStatusDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 flex items-center gap-2"
                  >
                    {status === opt && <CheckCircle2 size={12} className="text-blue-600" />}
                    <span className={`px-2 py-0.5 rounded-full font-medium ${statusLabels[opt].bg} ${statusLabels[opt].text}`}>
                      {statusLabels[opt].label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mx-4 mt-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2.5">Actions</p>
          <div className="grid grid-cols-5 gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={`${action.bg} rounded-2xl py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform shadow-sm`}
                >
                  <Icon size={16} className="text-white" />
                  <span className="text-white text-center leading-tight" style={{ fontSize: '8px', fontWeight: 600 }}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assignment */}
        <div className="mx-4 mt-3 mb-2 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Assigné à</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-sm font-bold">FH</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Fatima Zohra Haddad</p>
              <p className="text-xs text-slate-500">Agent — Secrétariat</p>
            </div>
            <button className="ml-auto text-xs text-blue-600 font-semibold px-3 py-1.5 bg-blue-50 rounded-xl">Changer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, ChevronRight, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, Archive } from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { BottomNav } from '../layout/BottomNav';
import { TopBar } from '../layout/TopBar';
import { incomingMail, outgoingMail } from '../../data/mockData';

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  Pending: { label: 'En attente', bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock size={9} /> },
  Received: { label: 'Reçu', bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 size={9} /> },
  Archived: { label: 'Archivé', bg: 'bg-slate-100', text: 'text-slate-600', icon: <Archive size={9} /> },
  Sent: { label: 'Envoyé', bg: 'bg-blue-100', text: 'text-blue-700', icon: <ArrowUpRight size={9} /> },
};

const categoryColors: Record<string, string> = {
  RH: 'bg-blue-50 text-blue-600',
  Finance: 'bg-purple-50 text-purple-600',
  Juridique: 'bg-cyan-50 text-cyan-600',
  Logistique: 'bg-green-50 text-green-600',
  Rapports: 'bg-orange-50 text-orange-600',
};

const filters = ['Date', 'Statut', 'Catégorie', 'Expéditeur'];

export function MailOverviewScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'incoming' | 'outgoing'>('incoming');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const displayMail: Array<typeof incomingMail[0] | typeof outgoingMail[0]> =
    activeTab === 'incoming' ? incomingMail
    : activeTab === 'outgoing' ? outgoingMail
    : [...incomingMail, ...outgoingMail];

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar title="Courrier" subtitle="Vue d'ensemble" showMenu showNotification notifCount={3} />

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 shrink-0">
        <div className="flex">
          {(['incoming', 'outgoing', 'all'] as const).map((tab) => {
            const labels = { incoming: 'Entrant', outgoing: 'Sortant', all: 'Tous' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}
              >
                {labels[tab]}
                {tab === 'incoming' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-white ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`} style={{ fontSize: '9px' }}>
                    {incomingMail.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filter */}
      <div className="bg-white px-4 pt-3 pb-2 shrink-0">
        <div className="relative mb-2.5">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Référence, expéditeur, objet..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <SlidersHorizontal size={14} className="text-blue-600" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${activeFilter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sort row */}
      <div className="px-4 py-2 flex items-center justify-between shrink-0 bg-slate-50 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">{displayMail.length} résultats</span>
        <button className="text-xs text-blue-600 font-medium">Trier par date ↓</button>
      </div>

      {/* Mail list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 pt-2 pb-2 space-y-2.5" style={{ scrollbarWidth: 'none' }}>
        {displayMail.map((mail) => {
          const isIncoming = 'sender' in mail;
          const status = statusConfig[mail.status] || statusConfig['Pending'];
          const catColor = categoryColors[mail.category] || 'bg-slate-50 text-slate-600';

          return (
            <button
              key={mail.id}
              onClick={() => navigate(isIncoming ? `/mail/incoming/${mail.id}` : `/mail/outgoing/${mail.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIncoming ? 'bg-blue-50' : 'bg-indigo-50'}`}>
                  {isIncoming
                    ? <ArrowDownLeft size={16} className="text-blue-600" />
                    : <ArrowUpRight size={16} className="text-indigo-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold text-blue-600 tracking-tight">{mail.ref}</span>
                    <span className={`text-xs flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-semibold ${status.bg} ${status.text}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate mb-0.5">
                    {isIncoming ? (mail as typeof incomingMail[0]).sender : (mail as typeof outgoingMail[0]).recipient}
                  </p>
                  <p className="text-xs text-slate-500 truncate leading-relaxed">{mail.subject}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                      {mail.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{mail.date}</span>
                      <ChevronRight size={11} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav active="mail" />
    </div>
  );
}
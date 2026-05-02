import { useState } from 'react';
import { ArrowLeft, Paperclip, FileText, Image, File, ChevronDown, ChevronUp, Clock, User, Tag, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { mailItems } from '../mockData';

export function MailDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ocrExpanded, setOcrExpanded] = useState(false);
  const mail = mailItems.find((m) => m.id === id) ?? mailItems[0];

  const attachIcon = (type: string) => {
    if (type === 'pdf') return FileText;
    if (type === 'image') return Image;
    return File;
  };

  const attachColor = (type: string) => {
    if (type === 'pdf') return 'bg-rose-50 text-rose-600';
    if (type === 'image') return 'bg-sky-50 text-sky-600';
    return 'bg-violet-50 text-violet-600';
  };

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={() => navigate(-1)} className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">Détail du courrier</p>
          <p className="text-indigo-200 text-[11px]">{mail.ref}</p>
        </div>
        <StatusBadge status={mail.status} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">

        {/* Header card */}
        <div className="bg-white border-b border-gray-100 px-5 py-4">
          <h2 className="text-gray-900 text-sm font-bold leading-snug mb-3">{mail.subject}</h2>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Date</p>
                <p className="text-xs text-gray-800 font-medium">{mail.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Catégorie</p>
                <p className="text-xs text-gray-800 font-medium">{mail.category}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 col-span-2">
              <Building2 size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {mail.type === 'incoming' ? 'Expéditeur' : 'Destinataire'}
                </p>
                <p className="text-xs text-gray-800 font-medium">
                  {mail.type === 'incoming' ? mail.sender : mail.recipient}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">

          {/* Description */}
          <section className="bg-white rounded-2xl shadow-sm px-4 py-3.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{mail.description}</p>
          </section>

          {/* Attachments */}
          {mail.attachments.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm px-4 py-3.5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Pièces jointes ({mail.attachments.length})
              </h3>
              <div className="space-y-2.5">
                {mail.attachments.map((att) => {
                  const Icon = attachIcon(att.type);
                  const color = attachColor(att.type);
                  return (
                    <button
                      key={att.id}
                      onClick={() => navigate(`/document/${att.id}`)}
                      className="w-full flex items-center gap-3 bg-gray-50 rounded-xl p-3 active:scale-[0.98] transition-transform"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-semibold text-gray-800 truncate">{att.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {att.type.toUpperCase()} · {att.size}
                          {att.pages ? ` · ${att.pages} pages` : ''}
                        </p>
                      </div>
                      <span className="text-[11px] text-indigo-600 font-semibold shrink-0">Ouvrir</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* OCR Section */}
          {mail.ocrText && (
            <section className="bg-white rounded-2xl shadow-sm px-4 py-3.5">
              <button
                onClick={() => setOcrExpanded(!ocrExpanded)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Texte extrait (OCR)
                </h3>
                {ocrExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {ocrExpanded && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-mono">
                    {mail.ocrText}
                  </p>
                </div>
              )}
              {!ocrExpanded && (
                <p className="mt-1.5 text-xs text-gray-400 line-clamp-2">{mail.ocrText}</p>
              )}
            </section>
          )}

          {/* Classification */}
          <section className="bg-white rounded-2xl shadow-sm px-4 py-3.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Classification</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">{mail.category}</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                mail.priority === 'urgent' ? 'bg-red-50 text-red-700' :
                mail.priority === 'high' ? 'bg-orange-50 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {mail.priority === 'urgent' ? '🔴 Urgent' : mail.priority === 'high' ? '🟠 Prioritaire' : '🟢 Normal'}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                mail.type === 'incoming' ? 'bg-violet-50 text-violet-700' : 'bg-teal-50 text-teal-700'
              }`}>
                {mail.type === 'incoming' ? '↙ Entrant' : '↗ Sortant'}
              </span>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-2xl shadow-sm px-4 py-3.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Historique</h3>
            <div className="relative pl-5">
              {/* Vertical line */}
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-indigo-100" />
              <div className="space-y-4">
                {mail.timeline.map((event, i) => (
                  <div key={event.id} className="relative flex items-start gap-3">
                    <div className={`absolute -left-[17px] w-3 h-3 rounded-full border-2 border-white ${
                      i === 0 ? 'bg-indigo-600' : 'bg-indigo-200'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{event.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <User size={10} />
                          {event.user}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock size={10} />
                          {event.date} à {event.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Read-only note */}
          <div className="bg-indigo-50 rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <p className="text-xs text-indigo-600">Mode consultation uniquement — aucune modification possible</p>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

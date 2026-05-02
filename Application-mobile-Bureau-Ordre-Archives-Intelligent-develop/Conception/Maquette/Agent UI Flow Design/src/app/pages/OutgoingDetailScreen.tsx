import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, Archive, ChevronDown, Paperclip, CheckCircle } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { useApp, OutgoingStatus } from '../contexts/AppContext';

export function OutgoingDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { outgoingMail, updateOutgoingStatus } = useApp();
  const mail = outgoingMail.find(m => m.id === id);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [archived, setArchived] = useState(false);

  if (!mail) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50">
        <p className="text-slate-400">Mail not found</p>
        <button onClick={() => navigate('/outgoing')} className="mt-3 text-sky-600 text-[14px] font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const statuses: OutgoingStatus[] = ['Draft', 'Sent', 'Delivered', 'Archived'];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #0c4a6e 0%, #0369a1 100%)' }}>
        <StatusBar light />
        <div className="flex items-center gap-3 px-4 pb-4 pt-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-[17px] font-bold">Mail Detail</h1>
            <p className="text-white/70 text-[11px]">{mail.reference}</p>
          </div>
          <StatusBadge status={mail.status} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3 border-b border-slate-50 bg-sky-50">
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Mail Information</span>
          </div>
          {[
            { label: 'Reference', value: mail.reference },
            { label: 'Date Sent', value: mail.dateSent },
            { label: 'Recipient', value: mail.recipient },
            { label: 'Subject', value: mail.subject },
          ].map(({ label, value }) => (
            <div key={label} className="flex px-4 py-3 border-b border-slate-50">
              <span className="w-28 text-slate-400 text-[12px] flex-shrink-0">{label}</span>
              <span className="text-slate-800 text-[13px] font-medium flex-1">{value}</span>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="text-slate-400 text-[12px] block mb-1">Description</span>
            <p className="text-slate-700 text-[13px] leading-relaxed">{mail.description || '—'}</p>
          </div>
        </div>

        {/* Attachments */}
        {mail.attachments.length > 0 && (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Paperclip size={14} className="text-sky-500" />
              <span className="text-[12px] font-bold text-slate-700">
                Attachments ({mail.attachments.length})
              </span>
            </div>
            {mail.attachments.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-red-600">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-[12px] font-medium truncate">{file}</p>
                  <p className="text-slate-400 text-[10px]">1.8 MB · PDF</p>
                </div>
                <button className="text-sky-500 text-[11px] font-semibold">View</button>
              </div>
            ))}
          </div>
        )}

        {/* Status Update */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-slate-700 text-[12px] font-bold mb-2">Update Status</p>
          <div className="relative">
            <button
              onClick={() => setShowStatusDrop(!showStatusDrop)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
            >
              <StatusBadge status={mail.status} />
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            {showStatusDrop && (
              <div
                className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      updateOutgoingStatus(mail.id, s);
                      setShowStatusDrop(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0"
                  >
                    <StatusBadge status={s} size="sm" />
                    {mail.status === s && <CheckCircle size={14} className="text-sky-500 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delivery tracking */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-slate-700 text-[12px] font-bold mb-3">Delivery Tracking</p>
          {[
            { label: 'Created', date: mail.dateSent, done: true },
            { label: 'Sent', date: mail.status !== 'Draft' ? mail.dateSent : null, done: mail.status !== 'Draft' },
            { label: 'Delivered', date: mail.status === 'Delivered' ? mail.dateSent : null, done: mail.status === 'Delivered' },
          ].map(({ label, date, done }, i) => (
            <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  {done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {i < 2 && <div className={`w-0.5 h-6 mt-1 ${done ? 'bg-emerald-200' : 'bg-slate-100'}`} />}
              </div>
              <div className="pt-0.5">
                <p className={`text-[13px] font-semibold ${done ? 'text-slate-800' : 'text-slate-400'}`}>{label}</p>
                {date && <p className="text-slate-400 text-[11px]">{date}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="h-2" />
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <button className="py-3 rounded-2xl bg-sky-50 text-sky-700 text-[13px] font-bold flex items-center justify-center gap-2">
            <Pencil size={15} /> Edit
          </button>
          <button
            onClick={() => {
              setArchived(true);
              updateOutgoingStatus(mail.id, 'Archived');
            }}
            className={`py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 ${
              archived ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Archive size={15} /> {archived ? 'Archived ✓' : 'Archive'}
          </button>
        </div>
        <button className="w-full py-3 rounded-2xl text-white text-[14px] font-bold"
          style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)' }}>
          Update Status
        </button>
      </div>
    </div>
  );
}

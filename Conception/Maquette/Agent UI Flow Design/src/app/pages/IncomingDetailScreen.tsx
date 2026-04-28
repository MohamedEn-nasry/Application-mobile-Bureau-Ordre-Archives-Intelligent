import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, RefreshCw, FileText, Tag, ChevronDown, Paperclip, CheckCircle, TrendingUp } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { useApp, MailStatus } from '../contexts/AppContext';

export function IncomingDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { incomingMail, updateIncomingStatus } = useApp();
  const mail = incomingMail.find(m => m.id === id);
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  if (!mail) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-50">
        <p className="text-slate-400">Mail not found</p>
        <button onClick={() => navigate('/incoming')} className="mt-3 text-indigo-600 text-[14px] font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  const statuses: MailStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived'];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #3730a3 0%, #4f46e5 100%)' }}>
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
          <div className="px-4 py-3 border-b border-slate-50 bg-indigo-50">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Mail Information</span>
          </div>
          {[
            { label: 'Reference', value: mail.reference },
            { label: 'Date Received', value: mail.dateReceived },
            { label: 'Sender', value: mail.sender },
            { label: 'Subject', value: mail.subject },
          ].map(({ label, value }) => (
            <div key={label} className="flex px-4 py-3 border-b border-slate-50">
              <span className="w-28 text-slate-400 text-[12px] flex-shrink-0">{label}</span>
              <span className="text-slate-800 text-[13px] font-medium flex-1">{value}</span>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="text-slate-400 text-[12px] block mb-1">Description</span>
            <p className="text-slate-700 text-[13px] leading-relaxed">{mail.description}</p>
          </div>
        </div>

        {/* Attachments */}
        {mail.attachments.length > 0 && (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Paperclip size={14} className="text-indigo-500" />
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
                  <p className="text-slate-400 text-[10px]">2.4 MB · PDF</p>
                </div>
                <button className="text-indigo-500 text-[11px] font-semibold">View</button>
              </div>
            ))}
          </div>
        )}

        {/* OCR Section */}
        {mail.ocrText && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-amber-50">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" />
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">OCR Extracted Text</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Processed</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-slate-600 text-[12px] leading-relaxed font-mono bg-slate-50 p-3 rounded-xl">
                {mail.ocrText}
              </p>
              <button
                onClick={() => navigate('/ocr')}
                className="mt-2 text-indigo-600 text-[12px] font-semibold"
              >
                Edit in OCR viewer →
              </button>
            </div>
          </div>
        )}

        {/* Classification */}
        {mail.classification && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 bg-emerald-50">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Classification</span>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-slate-800 text-[14px] font-bold">{mail.classification.category}</p>
                  <p className="text-slate-400 text-[11px]">Suggested category</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-emerald-600 text-[13px] font-bold">
                      {Math.round(mail.classification.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px]">Confidence</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full mb-3">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${mail.classification.confidence * 100}%` }}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {mail.classification.alternatives.map(alt => (
                  <span key={alt} className="text-[11px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                    {alt}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate('/classification')}
                className="mt-3 w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[12px] font-bold border border-emerald-200"
              >
                Review Classification
              </button>
            </div>
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
                      updateIncomingStatus(mail.id, s);
                      setShowStatusDrop(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <StatusBadge status={s} size="sm" />
                    {mail.status === s && <CheckCircle size={14} className="text-indigo-500 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <button
            onClick={() => navigate('/scan')}
            className="py-3 rounded-2xl bg-indigo-50 text-indigo-700 text-[13px] font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={15} /> Run OCR
          </button>
          <button
            onClick={() => navigate('/classification')}
            className="py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-[13px] font-bold flex items-center justify-center gap-2"
          >
            <Tag size={15} /> Classify
          </button>
        </div>
        <button
          className="w-full py-3 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
        >
          <Pencil size={16} /> Edit Mail
        </button>
      </div>
    </div>
  );
}

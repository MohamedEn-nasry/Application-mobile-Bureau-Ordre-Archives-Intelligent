import { useNavigate } from 'react-router';
import {
  Bell, Search, Inbox, Send, ClipboardList, ScanLine,
  Camera, FileText, ChevronRight, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../contexts/AppContext';

const profileUrl = "https://images.unsplash.com/photo-1771050889377-b68415885c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBvZmZpY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQzMTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=200";

export function DashboardScreen() {
  const navigate = useNavigate();
  const { incomingMail, outgoingMail, unreadCount } = useApp();

  const pendingIncoming = incomingMail.filter(m => m.status === 'Pending').length;
  const pendingOutgoing = outgoingMail.filter(m => m.status === 'Draft').length;
  const pendingTasks = incomingMail.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
  const recentScans = incomingMail.filter(m => m.ocrText).length;

  const assignedMail = incomingMail.slice(0, 3);
  const recentActivity = [
    { text: 'INC-2026-005 assigned to you', time: '9 min ago', color: 'bg-blue-500' },
    { text: 'OCR completed for INC-2026-003', time: '1h ago', color: 'bg-emerald-500' },
    { text: 'OUT-2026-001 marked as Delivered', time: '2h ago', color: 'bg-purple-500' },
    { text: 'Classification applied to INC-2026-002', time: 'Yesterday', color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(150deg, #3730a3 0%, #4f46e5 60%, #6366f1 100%)',
          paddingBottom: '24px',
        }}
      >
        <StatusBar light />

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-1 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={profileUrl}
              alt="Agent"
              className="w-9 h-9 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <p className="text-white/70 text-[11px]">Good Morning,</p>
              <p className="text-white text-[15px] font-bold leading-tight">Ahmed Benali</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Bell size={18} color="white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4">
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <Search size={16} color="rgba(255,255,255,0.7)" />
            <span className="text-white/60 text-[14px]">Search mail, references...</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 pb-4 mt-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Incoming Mail', value: incomingMail.length, sub: `${pendingIncoming} pending`, icon: Inbox, color: '#4f46e5', bg: '#EEF2FF' },
            { label: 'Outgoing Mail', value: outgoingMail.length, sub: `${pendingOutgoing} drafts`, icon: Send, color: '#0ea5e9', bg: '#F0F9FF' },
            { label: 'Pending Tasks', value: pendingTasks, sub: 'requires action', icon: ClipboardList, color: '#f59e0b', bg: '#FFFBEB' },
            { label: 'Recent Scans', value: recentScans, sub: 'OCR processed', icon: ScanLine, color: '#10b981', bg: '#ECFDF5' },
          ].map(({ label, value, sub, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-3.5"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <ArrowUpRight size={14} className="text-slate-300 mt-1" />
              </div>
              <div className="text-[24px] font-bold text-slate-800">{value}</div>
              <div className="text-[12px] font-semibold text-slate-700 leading-tight">{label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <h3 className="text-slate-800 text-[15px] font-bold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Add\nIncoming', icon: Inbox, color: '#4f46e5', bg: '#EEF2FF', path: '/incoming/add' },
            { label: 'Add\nOutgoing', icon: Send, color: '#0ea5e9', bg: '#F0F9FF', path: '/outgoing/add' },
            { label: 'Scan\nDocument', icon: Camera, color: '#10b981', bg: '#ECFDF5', path: '/scan' },
            { label: 'Run\nOCR', icon: FileText, color: '#f59e0b', bg: '#FFFBEB', path: '/ocr' },
          ].map(({ label, icon: Icon, color, bg, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-2.5 rounded-2xl bg-white transition-all active:scale-95"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight whitespace-pre-line">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Assigned Mail */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-800 text-[15px] font-bold">Assigned Mail</h3>
          <button
            onClick={() => navigate('/incoming')}
            className="flex items-center gap-1 text-indigo-600 text-[12px] font-semibold"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {assignedMail.map(mail => (
            <button
              key={mail.id}
              onClick={() => navigate(`/incoming/${mail.id}`)}
              className="bg-white rounded-2xl p-3.5 text-left w-full transition-all active:scale-[0.98]"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {mail.reference}
                </span>
                <StatusBadge status={mail.status} size="sm" />
              </div>
              <p className="text-slate-800 text-[13px] font-semibold mb-0.5 truncate">{mail.subject}</p>
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-[11px] truncate">{mail.sender}</p>
                <p className="text-slate-400 text-[11px] flex-shrink-0 ml-2">{mail.dateReceived}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-4">
        <h3 className="text-slate-800 text-[15px] font-bold mb-3">Recent Activity</h3>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i < recentActivity.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
              <p className="flex-1 text-slate-700 text-[12px] leading-snug">{item.text}</p>
              <span className="text-slate-400 text-[11px] flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OCR Results Preview */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-800 text-[15px] font-bold">OCR Results</h3>
          <button
            onClick={() => navigate('/ocr')}
            className="flex items-center gap-1 text-indigo-600 text-[12px] font-semibold"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <button
          onClick={() => navigate('/ocr')}
          className="w-full bg-white rounded-2xl p-3.5 text-left"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50">
              <FileText size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-slate-800 text-[13px] font-semibold">INC-2026-003 – Circulaire N°12</p>
              <p className="text-slate-400 text-[11px]">OCR completed • 24 Mar 2026</p>
            </div>
          </div>
          <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 italic">
            "NOTE CIRCULAIRE N°12 — Relative aux nouvelles procédures administratives. Aux: Directeurs régionaux..."
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-emerald-600 text-[11px] font-semibold">95% confidence</span>
          </div>
        </button>
      </div>
    </div>
  );
}

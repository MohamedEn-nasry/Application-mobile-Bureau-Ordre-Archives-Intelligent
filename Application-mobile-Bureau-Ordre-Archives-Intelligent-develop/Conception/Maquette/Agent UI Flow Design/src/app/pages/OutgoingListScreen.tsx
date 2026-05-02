import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Filter, ChevronDown, Send } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { useApp } from '../contexts/AppContext';

const filters = ['All', 'Date', 'Recipient', 'Subject', 'Status'];

export function OutgoingListScreen() {
  const navigate = useNavigate();
  const { outgoingMail } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = outgoingMail.filter(m => {
    const q = search.toLowerCase();
    return (
      m.reference.toLowerCase().includes(q) ||
      m.recipient.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #0c4a6e 0%, #0369a1 100%)', paddingBottom: '16px' }}>
        <StatusBar light />
        <div className="px-4 pt-1 pb-2">
          <h1 className="text-white text-[20px] font-bold mb-3">Outgoing Mail</h1>
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Search size={16} color="rgba(255,255,255,0.7)" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by reference, recipient..."
              className="flex-1 bg-transparent text-white placeholder-white/60 text-[13px] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-slate-100 px-3 py-2.5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                activeFilter === f ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {f}
              {f !== 'All' && <ChevronDown size={11} />}
            </button>
          ))}
          <button className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-semibold">
            <Filter size={12} /> Filters
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-2.5">
        <p className="text-slate-500 text-[12px]">
          <span className="font-bold text-slate-700">{filtered.length}</span> mail items
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Send size={40} className="mb-3 opacity-30" />
            <p className="text-[14px]">No mail found</p>
          </div>
        ) : (
          filtered.map(mail => (
            <button
              key={mail.id}
              onClick={() => navigate(`/outgoing/${mail.id}`)}
              className="w-full bg-white rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                  {mail.reference}
                </span>
                <StatusBadge status={mail.status} size="sm" />
              </div>

              <h4 className="text-slate-800 text-[14px] font-semibold mb-1 line-clamp-1">
                {mail.subject}
              </h4>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Send size={10} className="text-sky-600" />
                </div>
                <p className="text-slate-500 text-[12px] truncate">{mail.recipient}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {mail.attachments.length > 0 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      📎 {mail.attachments.length} file{mail.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px]">{mail.dateSent}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/outgoing/add')}
        className="absolute transition-all active:scale-90"
        style={{
          bottom: '16px',
          right: '16px',
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(14,165,233,0.4)',
          zIndex: 50,
        }}
      >
        <Plus size={22} color="white" />
      </button>
    </div>
  );
}
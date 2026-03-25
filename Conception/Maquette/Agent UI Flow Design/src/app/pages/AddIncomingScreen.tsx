import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Paperclip, ChevronDown, Save, X } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { useApp } from '../contexts/AppContext';

export function AddIncomingScreen() {
  const navigate = useNavigate();
  const { addIncomingMail } = useApp();

  const [form, setForm] = useState({
    reference: '',
    dateReceived: '',
    sender: '',
    subject: '',
    description: '',
    status: 'Pending' as const,
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.reference || !form.sender || !form.subject) return;
    setSaving(true);
    setTimeout(() => {
      addIncomingMail({ ...form, attachments });
      navigate('/incoming');
    }, 800);
  };

  const fields = [
    { label: 'Reference *', key: 'reference', placeholder: 'e.g. INC-2026-006', type: 'text' },
    { label: 'Date Received *', key: 'dateReceived', placeholder: 'YYYY-MM-DD', type: 'date' },
    { label: 'Sender *', key: 'sender', placeholder: 'Organization or person name', type: 'text' },
    { label: 'Subject *', key: 'subject', placeholder: 'Brief description of the mail', type: 'text' },
  ];

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
          <h1 className="text-white text-[18px] font-bold">Add Incoming Mail</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {fields.map(({ label, key, placeholder, type }) => (
          <div key={key}>
            <label className="block text-slate-700 text-[12px] font-semibold mb-1.5">{label}</label>
            <input
              type={type}
              value={(form as any)[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-2xl text-[13px] text-slate-800 outline-none bg-white border border-slate-200 focus:border-indigo-400 transition-colors"
            />
          </div>
        ))}

        {/* Description */}
        <div>
          <label className="block text-slate-700 text-[12px] font-semibold mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Additional details about this mail..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl text-[13px] text-slate-800 outline-none bg-white border border-slate-200 focus:border-indigo-400 transition-colors resize-none"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-slate-700 text-[12px] font-semibold mb-1.5">Attachments</label>
          <button
            onClick={() => setAttachments(prev => [...prev, `document_${prev.length + 1}.pdf`])}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center gap-2 text-indigo-500 text-[13px] font-semibold"
            style={{ background: '#F5F3FF' }}
          >
            <Paperclip size={16} />
            Attach File or Scan
          </button>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white rounded-xl px-3 py-2"
                  style={{ border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">PDF</span>
                    <span className="text-slate-700 text-[12px]">{file}</span>
                  </div>
                  <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}>
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-700 text-[12px] font-semibold mb-1.5">Status</label>
          <div className="relative">
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-[13px] text-slate-800 outline-none bg-white border border-slate-200 appearance-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Save button */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving || !form.reference || !form.sender || !form.subject}
          className="w-full py-3.5 rounded-2xl text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-all"
          style={{
            background: saving || !form.reference ? '#c7d2fe' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
            boxShadow: saving ? 'none' : '0 6px 20px rgba(99,102,241,0.3)',
          }}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save Incoming Mail
            </>
          )}
        </button>
      </div>
    </div>
  );
}

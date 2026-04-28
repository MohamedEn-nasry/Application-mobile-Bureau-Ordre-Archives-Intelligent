import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Tag, TrendingUp, ChevronDown, CheckCircle, Sparkles } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

const categories = [
  'Finance & Budget',
  'Circulaires & Directives',
  'Ressources Humaines',
  'Coordination & Réunions',
  'Facturation & Comptabilité',
  'Correspondance Officielle',
  'Rapports & Statistiques',
  'Réglementation',
  'Procédures Internes',
  'Autre',
];

const suggestions = [
  { category: 'Circulaires & Directives', confidence: 0.95, icon: '📋' },
  { category: 'Réglementation', confidence: 0.72, icon: '⚖️' },
  { category: 'Procédures Internes', confidence: 0.58, icon: '🔧' },
];

export function ClassificationScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(suggestions[0].category);
  const [showDropdown, setShowDropdown] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      setTimeout(() => navigate(-1), 800);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #064e3b 0%, #059669 100%)' }}>
        <StatusBar light />
        <div className="flex items-center gap-3 px-4 pb-4 pt-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 className="text-white text-[18px] font-bold">Classification</h1>
          <div className="ml-auto flex items-center gap-1.5 bg-white/15 rounded-full px-2.5 py-1">
            <Sparkles size={12} color="white" />
            <span className="text-white text-[11px] font-semibold">AI Powered</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Document reference */}
        <div
          className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Tag size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-800 text-[14px] font-semibold">INC-2026-003</p>
            <p className="text-slate-400 text-[12px]">Note circulaire N°12 · 22 Mar 2026</p>
          </div>
        </div>

        {/* Top suggestion */}
        <div>
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-2 px-1">
            AI Suggested Category
          </p>
          <div
            className="bg-white rounded-2xl p-4 border-2 border-emerald-200"
            style={{ boxShadow: '0 4px 16px rgba(5,150,105,0.12)' }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{suggestions[0].icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-800 text-[16px] font-bold">{suggestions[0].category}</h3>
                  <span className="text-emerald-600 text-[13px] font-bold flex items-center gap-1">
                    <TrendingUp size={13} />
                    {Math.round(suggestions[0].confidence * 100)}%
                  </span>
                </div>
                <p className="text-slate-400 text-[12px] mt-0.5">Best match based on OCR content</p>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 text-[11px]">Confidence Score</span>
                <span className="text-emerald-700 text-[11px] font-bold">
                  {Math.round(suggestions[0].confidence * 100)}% — Very High
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${suggestions[0].confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <p className="text-slate-400 text-[11px] mb-1.5">Detected keywords</p>
              <div className="flex gap-1.5 flex-wrap">
                {['circulaire', 'procédures', 'administratif', 'directives', 'dématérialisation'].map(kw => (
                  <span key={kw} className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alternative suggestions */}
        <div>
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-2 px-1">
            Alternative Suggestions
          </p>
          <div className="space-y-2">
            {suggestions.slice(1).map(({ category, confidence, icon }) => (
              <button
                key={category}
                onClick={() => setSelected(category)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white text-left transition-all ${
                  selected === category ? 'border-2 border-emerald-300' : 'border border-slate-100'
                }`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-700 text-[13px] font-semibold">{category}</p>
                    <span className={`text-[12px] font-bold ${confidence > 0.7 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                </div>
                {selected === category && (
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Manual override */}
        <div>
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-2 px-1">
            Manual Override
          </p>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-left"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-slate-400" />
                <span className="text-slate-700 text-[13px] font-medium">{selected}</span>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            {showDropdown && (
              <div
                className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl overflow-hidden z-20 max-h-48 overflow-y-auto"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelected(cat);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 text-left"
                  >
                    <span className="text-slate-700 text-[13px]">{cat}</span>
                    {selected === cat && <CheckCircle size={14} className="text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* Apply button */}
      <div className="px-4 py-3 bg-white border-t border-slate-100">
        {applied ? (
          <div className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-700 text-[15px] font-bold flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            Classification Applied!
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full py-4 rounded-2xl text-white text-[15px] font-bold flex items-center justify-center gap-2"
            style={{
              background: applying ? '#6ee7b7' : 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: applying ? 'none' : '0 6px 20px rgba(5,150,105,0.3)',
            }}
          >
            {applying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Tag size={17} />
                Apply Classification: {selected}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

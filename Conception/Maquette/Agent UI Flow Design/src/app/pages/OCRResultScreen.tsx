import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, CheckCircle, Paperclip, Copy, Wand2 } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

const sampleOCRText = `NOTE CIRCULAIRE N°12

Relative aux nouvelles procédures administratives

Aux: Directeurs régionaux
De: Cabinet du Ministre
Date: 22/03/2026

Objet: Mise en place de nouvelles procédures administratives

Monsieur le Directeur,

Dans le cadre de la modernisation de notre système administratif et de l'amélioration de la qualité des services rendus aux citoyens, nous avons le plaisir de vous informer de la mise en place de nouvelles procédures administratives.

Ces mesures concernent notamment:
1. La dématérialisation des dossiers
2. La mise en place d'un système de suivi numérique
3. La formation du personnel aux nouveaux outils

Nous vous prions de bien vouloir prendre connaissance des modalités de mise en œuvre décrites en annexe.

Veuillez agréer, Monsieur le Directeur, l'expression de notre haute considération.

Le Ministre
M. Hassan Alaoui`;

export function OCRResultScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState(sampleOCRText);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
    }, 1000);
  };

  const highlightedText = searchQuery
    ? text.replace(
        new RegExp(`(${searchQuery})`, 'gi'),
        '<mark style="background:#FEF08A;border-radius:2px">$1</mark>'
      )
    : text;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg, #78350f 0%, #d97706 100%)' }}>
        <StatusBar light />
        <div className="flex items-center gap-3 px-4 pb-4 pt-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <h1 className="text-white text-[18px] font-bold">OCR Result</h1>
          <div className="ml-auto flex items-center gap-1.5 bg-white/15 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white text-[11px] font-semibold">Processed</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Wand2 size={13} className="text-amber-600" />
          <span className="text-amber-700 text-[12px] font-semibold">Accuracy: 97.2%</span>
        </div>
        <div className="h-3 w-px bg-amber-200" />
        <span className="text-amber-600 text-[11px]">{wordCount} words</span>
        <div className="h-3 w-px bg-amber-200" />
        <span className="text-amber-600 text-[11px]">{charCount} chars</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Document preview thumbnail */}
        <div className="mx-4 mt-4 mb-3">
          <div
            className="flex items-center gap-3 p-3 rounded-2xl bg-white"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            {/* Thumbnail */}
            <div
              className="w-16 h-20 rounded-xl flex-shrink-0 overflow-hidden"
              style={{ background: '#f1f5f9' }}
            >
              <div className="p-1.5 space-y-1">
                <div className="h-1 bg-slate-700 rounded-full w-full" />
                <div className="h-0.5 bg-slate-300 rounded-full w-4/5" />
                {[0.9, 0.7, 0.85, 0.6, 0.75, 0.5, 0.65, 0.8].map((w, i) => (
                  <div key={i} className="h-0.5 bg-slate-300 rounded-full" style={{ width: `${w * 100}%` }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-800 text-[13px] font-semibold">Scanned Document</p>
              <p className="text-slate-500 text-[11px]">INC-2026-003 · PDF · Page 1 of 1</p>
              <p className="text-amber-600 text-[11px] font-semibold mt-0.5">OCR completed ✓</p>
            </div>
          </div>
        </div>

        {/* Search inside text */}
        <div className="mx-4 mb-3">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200"
          >
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search inside text..."
              className="flex-1 bg-transparent text-slate-700 text-[13px] outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 text-[11px]">Clear</button>
            )}
          </div>
        </div>

        {/* Extracted text */}
        <div className="mx-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-700 text-[12px] font-bold">Extracted Text</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Copy size={12} /> Copy
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            {searchQuery ? (
              <div
                className="p-4 text-slate-700 text-[12px] leading-relaxed font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            ) : (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-4 text-slate-700 text-[12px] leading-relaxed font-mono bg-transparent outline-none resize-none"
                rows={18}
              />
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className={`py-3 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              confirmed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {confirming ? (
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle size={15} />
            )}
            {confirmed ? 'Confirmed ✓' : 'Confirm OCR'}
          </button>
          <button
            onClick={() => navigate('/classification')}
            className="py-3 rounded-2xl bg-indigo-50 text-indigo-700 text-[13px] font-bold flex items-center justify-center gap-2"
          >
            <Paperclip size={15} /> Attach to Mail
          </button>
        </div>
        <button
          onClick={() => navigate('/classification')}
          className="w-full py-3 rounded-2xl text-white text-[14px] font-bold"
          style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}
        >
          Proceed to Classification
        </button>
      </div>
    </div>
  );
}

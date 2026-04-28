import { useState } from 'react';
import { ArrowLeft, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, X, Wifi, Battery, Signal } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const mockDocContent = [
  { type: 'title', text: 'CIRCULAIRE N° 42/2024' },
  { type: 'subtitle', text: "Objet : Nouvelles procédures administratives" },
  { type: 'meta', text: "Référence : Décret exécutif n° 24-087 du 5 mars 2024" },
  { type: 'section', text: '1. Introduction' },
  { type: 'body', text: "Dans le cadre de la modernisation de l'administration publique et conformément aux orientations du Gouvernement, il est demandé à l'ensemble des services concernés de mettre en œuvre les nouvelles procédures administratives décrites ci-après." },
  { type: 'body', text: "Ces mesures visent à rationaliser le traitement des dossiers administratifs, à améliorer l'efficacité des services publics et à garantir une meilleure traçabilité des actes administratifs." },
  { type: 'section', text: '2. Champ d\'application' },
  { type: 'body', text: "Les présentes dispositions s'appliquent à l'ensemble des administrations et établissements publics relevant du ministère, ainsi qu'aux organismes placés sous sa tutelle." },
  { type: 'section', text: '3. Nouvelles procédures' },
  { type: 'body', text: "3.1 Enregistrement du courrier : Tout courrier entrant doit être enregistré dans le système informatique dans un délai maximum de 24 heures suivant sa réception." },
  { type: 'body', text: "3.2 Traitement et délais : Le délai de traitement des correspondances ordinaires est fixé à 10 jours ouvrables. Pour les correspondances urgentes, ce délai est ramené à 3 jours ouvrables." },
];

const docNames: Record<string, string> = {
  a1: 'Circulaire_N42_2024.pdf',
  a2: 'Annexe_Procedures.pdf',
  a3: 'Rapport_Inspection_T1_2024.pdf',
  a4: 'Convocation_TA_25032024.pdf',
  a5: 'Budget_Previsionnel_2024-2025.xlsx',
  a6: 'Note_Explicative.pdf',
  a7: 'Statistiques_Annuelles_2023.pdf',
  a8: 'Directives_Budgetaires_2024.pdf',
};

export function DocumentViewerScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(8);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const docName = docNames[id ?? 'a1'] ?? 'Document.pdf';

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Status Bar */}
      <div className="bg-gray-950 flex items-center justify-between px-5 shrink-0" style={{ height: 28, paddingTop: 4 }}>
        <span className="text-white text-xs font-semibold">10:30</span>
        <div className="flex items-center gap-1.5">
          <Signal size={11} className="text-white/80" />
          <Wifi size={11} className="text-white/80" />
          <Battery size={12} className="text-white/80" />
        </div>
      </div>

      {/* App Bar */}
      <div className="bg-gray-900 border-b border-gray-800 flex items-center gap-3 px-4 py-3 shrink-0">
        <button onClick={() => navigate(-1)} className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">{docName}</p>
          <p className="text-gray-400 text-[10px]">Visionneuse de document</p>
        </div>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center"
        >
          <Search size={16} className="text-gray-300" />
        </button>
        <button className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center">
          <Download size={16} className="text-gray-300" />
        </button>
      </div>

      {/* Search in doc */}
      {searchOpen && (
        <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2 shrink-0">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans le document…"
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Doc info bar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between shrink-0">
        <span className="text-gray-400 text-[11px]">PDF · 8 pages · 1.2 MB</span>
        <span className="text-gray-400 text-[11px]">BDO-2024-IN-0142</span>
      </div>

      {/* Document preview */}
      <div className="flex-1 overflow-y-auto bg-gray-700 flex justify-center py-4 px-3">
        <div
          className="bg-white rounded shadow-2xl origin-top transition-all duration-200"
          style={{
            width: `${Math.min(100, zoom)}%`,
            maxWidth: 340,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Page header */}
          <div className="bg-indigo-700 px-5 py-3 flex items-center justify-between rounded-t">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                <div className="w-3 h-3 border border-white/60 rounded-sm" />
              </div>
              <span className="text-white text-[10px] font-bold">République Algérienne</span>
            </div>
            <span className="text-indigo-200 text-[10px]">Page {page}/{totalPages}</span>
          </div>

          {/* Page content */}
          <div className="px-5 py-4 space-y-3 min-h-64">
            {mockDocContent.map((block, i) => (
              <div key={i}>
                {block.type === 'title' && (
                  <p className="text-gray-900 text-sm font-bold text-center py-1">{block.text}</p>
                )}
                {block.type === 'subtitle' && (
                  <p className="text-gray-700 text-xs font-semibold text-center">{block.text}</p>
                )}
                {block.type === 'meta' && (
                  <p className="text-gray-500 text-[10px] text-center italic">{block.text}</p>
                )}
                {block.type === 'section' && (
                  <p className="text-gray-800 text-xs font-bold mt-2 border-b border-gray-100 pb-1">{block.text}</p>
                )}
                {block.type === 'body' && (
                  <p className={`text-[11px] text-gray-600 leading-relaxed ${
                    searchQuery && block.text.toLowerCase().includes(searchQuery.toLowerCase())
                      ? 'bg-yellow-50 rounded px-1'
                      : ''
                  }`}>
                    {block.text}
                  </p>
                )}
              </div>
            ))}
            {/* Page footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <span className="text-[9px] text-gray-300">Confidentiel – Usage interne</span>
              <span className="text-[9px] text-gray-300">Page {page}/{totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 shrink-0">
        {/* Page navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-[11px] font-medium transition-all ${
                  page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 5 && <span className="text-gray-600 text-xs">…{totalPages}</span>}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center disabled:opacity-40"
          >
            <ZoomOut size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-gray-700 rounded-full">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${((zoom - 50) / 150) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs w-10 text-center">{zoom}%</span>
          </div>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center disabled:opacity-40"
          >
            <ZoomIn size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { MailCard } from '../components/MailCard';
import { mailItems } from '../mockData';

const FILTER_TAGS = [
  { id: 'incoming', label: '↙ Entrants' },
  { id: 'outgoing', label: '↗ Sortants' },
  { id: 'received', label: 'Reçus' },
  { id: 'urgent', label: '🔴 Urgent' },
  { id: 'processing', label: 'En traitement' },
];

export function SearchResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initial = params.get('q') ?? '';

  const [query, setQuery] = useState(initial);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filtered = mailItems.filter((m) => {
    const matchQuery =
      !query ||
      m.subject.toLowerCase().includes(query.toLowerCase()) ||
      m.ref.toLowerCase().includes(query.toLowerCase()) ||
      (m.sender || '').toLowerCase().includes(query.toLowerCase()) ||
      (m.recipient || '').toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase());

    const matchFilters =
      activeFilters.length === 0 ||
      activeFilters.some(
        (f) => f === m.type || f === m.status
      );

    return matchQuery && matchFilters;
  });

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* Search bar app bar */}
      <div className="bg-indigo-700 px-4 pt-3 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex-1 bg-white/15 rounded-xl flex items-center px-3 py-2 gap-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un courrier, document…"
              className="flex-1 bg-transparent text-white text-sm placeholder-indigo-200 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-indigo-200">
                <X size={14} />
              </button>
            )}
          </div>
          <button className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <SlidersHorizontal size={16} className="text-white" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleFilter(tag.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                activeFilters.includes(tag.id)
                  ? 'bg-white text-indigo-700 border-white'
                  : 'bg-transparent text-indigo-200 border-indigo-500'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shrink-0">
        <span className="text-xs text-gray-500">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          {query ? ` pour « ${query} »` : ''}
        </span>
        {(activeFilters.length > 0 || query) && (
          <button
            onClick={() => { setQuery(''); setActiveFilters([]); }}
            className="text-xs text-indigo-600 font-medium flex items-center gap-1"
          >
            <X size={12} /> Effacer
          </button>
        )}
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">Aucun résultat</p>
              <p className="text-xs text-gray-400 mt-1">
                {query ? `Aucun courrier ne correspond à « ${query} »` : 'Saisissez un mot-clé pour rechercher'}
              </p>
            </div>
            {query && (
              <div className="bg-white rounded-2xl shadow-sm px-4 py-3 w-full">
                <p className="text-xs font-semibold text-gray-600 mb-2">Suggestions :</p>
                <p className="text-xs text-gray-500">· Vérifiez l'orthographe du terme</p>
                <p className="text-xs text-gray-500 mt-1">· Essayez des mots-clés plus généraux</p>
                <p className="text-xs text-gray-500 mt-1">· Utilisez la référence du courrier</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((item) => (
              <MailCard key={item.id} item={item} highlight={query} />
            ))}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}
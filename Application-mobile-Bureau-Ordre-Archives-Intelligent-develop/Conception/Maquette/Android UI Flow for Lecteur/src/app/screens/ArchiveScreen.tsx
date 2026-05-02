import { useState } from 'react';
import { Archive, ChevronRight, Inbox, Send } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { SearchInput } from '../components/SearchInput';
import { FilterChips } from '../components/FilterChips';
import { archiveItems } from '../mockData';

const FILTERS = [
  { id: 'incoming', label: '↙ Entrants' },
  { id: 'outgoing', label: '↗ Sortants' },
  { id: 'rapport', label: 'Rapport' },
  { id: 'budget', label: 'Budget' },
  { id: 'circulaire', label: 'Circulaire' },
];

const categoryColor: Record<string, string> = {
  Convention: 'bg-violet-50 text-violet-700',
  Rapport: 'bg-blue-50 text-blue-700',
  Budget: 'bg-amber-50 text-amber-700',
  Circulaire: 'bg-indigo-50 text-indigo-700',
  'Compte-rendu': 'bg-teal-50 text-teal-700',
  Sécurité: 'bg-rose-50 text-rose-700',
};

export function ArchiveScreen() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered = archiveItems.filter((item) => {
    const matchQ =
      !query ||
      item.subject.toLowerCase().includes(query.toLowerCase()) ||
      item.ref.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());

    const matchF =
      activeFilters.length === 0 ||
      activeFilters.some(
        (f) => f === item.type || item.category.toLowerCase() === f
      );

    return matchQ && matchF;
  });

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 px-5 pt-3 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <Archive size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-base font-bold">Archive</h1>
            <p className="text-indigo-200 text-xs">{archiveItems.length} documents archivés</p>
          </div>
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher dans l'archive…"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 shrink-0">
        <FilterChips chips={FILTERS} active={activeFilters} onToggle={toggleFilter} />
      </div>

      {/* Archive list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 gap-3 text-gray-400">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Archive size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium">Aucun élément trouvé</p>
            <p className="text-xs">Modifiez vos filtres de recherche</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((item) => {
              const catColor = categoryColor[item.category] ?? 'bg-gray-100 text-gray-600';
              return (
                <Link
                  key={item.id}
                  to={`/app/mail/${item.id}`}
                  className="block bg-white rounded-2xl shadow-sm px-4 py-3.5 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === 'incoming' ? 'bg-indigo-50' : 'bg-emerald-50'
                      }`}>
                        {item.type === 'incoming'
                          ? <Inbox size={14} className="text-indigo-500" />
                          : <Send size={14} className="text-emerald-500" />
                        }
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">{item.ref}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${catColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-900 font-semibold leading-snug mb-2 line-clamp-2">
                    {item.subject}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400">Archivé le</p>
                        <p className="text-xs text-gray-600 font-medium">{item.dateArchived}</p>
                      </div>
                      <div className="w-px h-6 bg-gray-100" />
                      <div>
                        <p className="text-[10px] text-gray-400">Date originale</p>
                        <p className="text-xs text-gray-600 font-medium">{item.originalDate}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1">
                    <Archive size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">Archivé par {item.archivedBy}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

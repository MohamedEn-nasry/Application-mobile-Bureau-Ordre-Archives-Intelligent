import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StatusBar } from '../components/StatusBar';
import { MailCard } from '../components/MailCard';
import { FilterChips } from '../components/FilterChips';
import { SearchInput } from '../components/SearchInput';
import { mailItems } from '../mockData';
import type { MailType } from '../types';

const TABS: { id: MailType | 'archive'; label: string }[] = [
  { id: 'incoming', label: 'Entrants' },
  { id: 'outgoing', label: 'Sortants' },
  { id: 'archive', label: 'Archive' },
];

const FILTERS = [
  { id: 'date', label: 'Date' },
  { id: 'sender', label: 'Expéditeur' },
  { id: 'subject', label: 'Objet' },
  { id: 'status', label: 'Statut' },
  { id: 'category', label: 'Catégorie' },
];

export function MailListScreen() {
  const [activeTab, setActiveTab] = useState<MailType | 'archive'>('incoming');
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered = mailItems
    .filter((m) => {
      if (activeTab === 'archive') return m.status === 'archived';
      return m.type === activeTab;
    })
    .filter((m) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        m.subject.toLowerCase().includes(q) ||
        m.ref.toLowerCase().includes(q) ||
        (m.sender || '').toLowerCase().includes(q) ||
        (m.recipient || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className="h-full flex flex-col">
      <StatusBar />
      {/* App Bar */}
      <div className="bg-indigo-700 px-5 pt-3 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-base font-bold">Courrier</h1>
          <button onClick={() => navigate('/app/search')} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
            <Search size={18} className="text-white" />
          </button>
        </div>
        {/* Search */}
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Rechercher un courrier…"
        />
      </div>

      {/* Tabs */}
      <div className="bg-indigo-700 px-5 pb-0 shrink-0">
        <div className="flex gap-0 border-b border-indigo-600">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-all relative ${
                activeTab === tab.id ? 'text-white' : 'text-indigo-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white px-4 py-2.5 border-b border-gray-100 shrink-0">
        <FilterChips chips={FILTERS} active={activeFilters} onToggle={toggleFilter} />
      </div>

      {/* Mail list */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3 text-gray-400">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium">Aucun courrier trouvé</p>
            <p className="text-xs text-center">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        ) : (
          filtered.map((item) => (
            <MailCard key={item.id} item={item} highlight={query} />
          ))
        )}
        <div className="h-2" />
      </div>
    </div>
  );
}

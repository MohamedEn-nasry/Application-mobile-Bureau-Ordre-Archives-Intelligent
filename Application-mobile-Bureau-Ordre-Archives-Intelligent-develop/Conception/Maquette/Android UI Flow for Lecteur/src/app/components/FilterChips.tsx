import { X } from 'lucide-react';

interface Chip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: Chip[];
  active: string[];
  onToggle: (id: string) => void;
}

export function FilterChips({ chips, active, onToggle }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {chips.map((chip) => {
        const isActive = active.includes(chip.id);
        return (
          <button
            key={chip.id}
            onClick={() => onToggle(chip.id)}
            className={`flex items-center gap-1 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {chip.label}
            {isActive && <X size={11} className="ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
}

import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({ value, onChange, placeholder = 'Rechercher...', autoFocus }: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-gray-100 rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

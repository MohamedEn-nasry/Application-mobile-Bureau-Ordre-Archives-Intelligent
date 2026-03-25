import { ChevronRight, Paperclip } from 'lucide-react';
import { Link } from 'react-router';
import type { MailItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface MailCardProps {
  item: MailItem;
  highlight?: string;
}

const typeAccent: Record<string, string> = {
  incoming: 'border-l-indigo-500',
  outgoing: 'border-l-emerald-500',
};

export function MailCard({ item, highlight }: MailCardProps) {
  const party = item.type === 'incoming' ? item.sender : item.recipient;

  const highlightText = (text: string) => {
    if (!highlight) return text;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + highlight.length)}</mark>
        {text.slice(idx + highlight.length)}
      </>
    );
  };

  return (
    <Link
      to={`/app/mail/${item.id}`}
      className={`block bg-white rounded-2xl shadow-sm border-l-4 ${typeAccent[item.type]} px-4 py-3.5 active:scale-[0.98] transition-transform`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-[10px] text-indigo-500 font-semibold tracking-wide">{item.ref}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <p className="text-sm text-gray-900 font-semibold leading-snug mb-1 line-clamp-2">
        {highlightText(item.subject)}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-gray-500 truncate flex-1 mr-2">
          {item.type === 'incoming' ? '↙ ' : '↗ '}
          {highlightText(party || '')}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Paperclip size={10} />
              {item.attachments.length}
            </span>
          )}
          <span className="text-[10px] text-gray-400">{item.date}</span>
          <ChevronRight size={14} className="text-gray-300" />
        </div>
      </div>
    </Link>
  );
}

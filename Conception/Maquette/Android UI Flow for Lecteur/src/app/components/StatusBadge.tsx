import type { MailStatus } from '../types';

const config: Record<MailStatus, { label: string; bg: string; text: string; dot: string }> = {
  received: { label: 'Reçu', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  processing: { label: 'En traitement', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  pending: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  sent: { label: 'Envoyé', bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  archived: { label: 'Archivé', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  urgent: { label: 'Urgent', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

interface StatusBadgeProps {
  status: MailStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status];
  const pad = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const font = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${pad} ${c.bg} ${c.text} ${font} font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

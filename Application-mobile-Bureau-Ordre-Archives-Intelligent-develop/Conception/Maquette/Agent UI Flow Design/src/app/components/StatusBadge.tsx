type StatusType =
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Archived'
  | 'Draft'
  | 'Sent'
  | 'Delivered';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Archived: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  Draft: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  Sent: { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = statusConfig[status] || statusConfig['Pending'];
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const fontSize = size === 'sm' ? 'text-[10px]' : 'text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1 ${padding} rounded-full ${cfg.bg} ${cfg.text} ${fontSize} font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
